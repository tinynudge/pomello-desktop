import { TranslationLocation, TranslationsDictionary } from '@pomello-desktop/domain';
import { app } from 'electron';
import fs from 'fs';
import { join, resolve } from 'path';

const cachedTranslations: Record<string, TranslationsDictionary> = {};

const defaultLocale = 'en-US';

const basePath = import.meta.env.DEV ? join(__dirname, '../../..') : process.resourcesPath;

const loadTranslations = (locale: string, directory: string) => {
  const filePath = resolve(basePath, directory, `${locale}.json`);

  try {
    const contents = fs.readFileSync(filePath, 'utf8');

    return JSON.parse(contents);
  } catch (error) {
    return {};
  }
};

export const getTranslations = (location: TranslationLocation): TranslationsDictionary => {
  const namespace = typeof location === 'string' ? location : location.serviceId;

  // Don't use the cached translations during dev to make it easier to get fresh
  // translations.
  if (cachedTranslations[namespace] && !import.meta.env.DEV) {
    return cachedTranslations[namespace];
  }

  const locales = new Set([defaultLocale, app.getLocale()]);

  const directory =
    typeof location === 'string'
      ? `translations/${location}`
      : `packages/renderer/src/services/${location.serviceId}/translations`;

  const translations = Array.from(locales.values()).map(locale =>
    loadTranslations(locale, directory)
  );

  cachedTranslations[namespace] = Object.assign({}, ...translations);

  return cachedTranslations[namespace];
};
