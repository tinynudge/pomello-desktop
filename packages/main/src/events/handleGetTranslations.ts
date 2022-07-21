import { Translations } from '@domain';
import fs from 'fs/promises';
import { app } from 'electron';
import { join, resolve } from 'path';

let cachedTranslations: Translations;

const defaultLocale = 'en-US';

const basePath = import.meta.env.DEV
  ? join(__dirname, '../..')
  : join(process.resourcesPath, 'packages');

const getTranslations = async (locale: string) => {
  const filePath = resolve(basePath, 'translations', `${locale}.json`);

  const contents = await fs.readFile(filePath, 'utf8').catch(() => '{}');

  return JSON.parse(contents);
};

const handleGetTranslations = async (): Promise<Translations> => {
  // Don't use the cached translations during dev to make it easier to get fresh
  // translations.
  if (cachedTranslations && !import.meta.env.DEV) {
    return cachedTranslations;
  }

  const locales = new Set([defaultLocale, app.getLocale()]);

  const translations = await Promise.all(Array.from(locales.values()).map(getTranslations));

  cachedTranslations = Object.assign({}, ...translations);

  return cachedTranslations;
};

export default handleGetTranslations;
