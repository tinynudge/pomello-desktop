import { Translations } from '@domain';
import { app, IpcMainInvokeEvent } from 'electron';
import fs from 'fs/promises';
import { join, resolve } from 'path';

const cachedTranslations: Record<string, Translations> = {};

const defaultLocale = 'en-US';

const basePath = import.meta.env.DEV
  ? join(__dirname, '../..')
  : join(process.resourcesPath, 'packages');

const getTranslations = async (locale: string, serviceId?: string) => {
  const translationsDirectory = serviceId
    ? `renderer/src/services/${serviceId}/translations`
    : 'translations';

  const filePath = resolve(basePath, translationsDirectory, `${locale}.json`);

  const contents = await fs.readFile(filePath, 'utf8').catch(() => '{}');

  return JSON.parse(contents);
};

const handleGetTranslations = async (
  _event: IpcMainInvokeEvent,
  serviceId?: string
): Promise<Translations> => {
  const namespace = serviceId ?? 'common';

  // Don't use the cached translations during dev to make it easier to get fresh
  // translations.
  if (cachedTranslations[namespace] && !import.meta.env.DEV) {
    return cachedTranslations[namespace];
  }

  const locales = new Set([defaultLocale, app.getLocale()]);

  const translations = await Promise.all(
    Array.from(locales.values()).map(locale => getTranslations(locale, serviceId))
  );

  cachedTranslations[namespace] = Object.assign({}, ...translations);

  return cachedTranslations[namespace];
};

export default handleGetTranslations;
