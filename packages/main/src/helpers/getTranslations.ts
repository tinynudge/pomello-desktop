import { TranslationsDictionary } from '@domain';
import { app } from 'electron';
import fs from 'fs';
import { join, resolve } from 'path';

const cachedTranslations: Record<string, TranslationsDictionary> = {};

const defaultLocale = 'en-US';

const basePath = import.meta.env.DEV
  ? join(__dirname, '../..')
  : join(process.resourcesPath, 'packages');

const loadTranslations = (locale: string, serviceId?: string) => {
  const translationsDirectory = serviceId
    ? `renderer/src/services/${serviceId}/translations`
    : 'translations';

  const filePath = resolve(basePath, translationsDirectory, `${locale}.json`);

  try {
    const contents = fs.readFileSync(filePath, 'utf8');

    return JSON.parse(contents);
  } catch (error) {
    return {};
  }
};

const getTranslations = (serviceId?: string): TranslationsDictionary => {
  const namespace = serviceId ?? 'common';

  // Don't use the cached translations during dev to make it easier to get fresh
  // translations.
  if (cachedTranslations[namespace] && !import.meta.env.DEV) {
    return cachedTranslations[namespace];
  }

  const locales = new Set([defaultLocale, app.getLocale()]);

  const translations = Array.from(locales.values()).map(locale =>
    loadTranslations(locale, serviceId)
  );

  cachedTranslations[namespace] = Object.assign({}, ...translations);

  return cachedTranslations[namespace];
};

export default getTranslations;
