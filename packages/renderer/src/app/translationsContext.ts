import type { Translations, TranslationsDictionary } from '@domain';
import { getContext, setContext } from 'svelte';
import { writable, type Writable } from 'svelte/store';

interface TranslationsContext {
  addNamespace(namespace: string, translations: TranslationsDictionary): void;
  removeNamespace(namespace: string): void;
  translations: Writable<Translations>;
}

const translationsContext = 'translations';

const setTranslationsContext = (commonTranslations: TranslationsDictionary) => {
  const translations = writable<Translations>({ common: commonTranslations });

  const addNamespace = (namespace: string, newTranslations: TranslationsDictionary): void => {
    translations.update(previousTranslations => ({
      ...previousTranslations,
      [namespace]: newTranslations,
    }));
  };

  const removeNamespace = (namespace: string): void => {
    translations.update(previousTranslations => {
      const updatedTranslations = { ...previousTranslations };

      delete updatedTranslations[namespace];

      return updatedTranslations;
    });
  };

  setContext(translationsContext, {
    addNamespace,
    removeNamespace,
    translations,
  });
};

const getTranslationsContext = (): TranslationsContext => {
  return getContext(translationsContext);
};

export { getTranslationsContext, setTranslationsContext };
