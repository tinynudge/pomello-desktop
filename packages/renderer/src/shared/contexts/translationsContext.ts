import type { Translations, TranslationsDictionary } from '@domain';
import { getContext, setContext } from 'svelte';
import { writable, type Writable } from 'svelte/store';

const translationsContext = 'translations';

const setTranslationsContext = (commonTranslations: TranslationsDictionary) => {
  const translations = writable<Translations>({ common: commonTranslations });

  setContext(translationsContext, translations);
};

const getTranslationsContext = (): Writable<Translations> => {
  return getContext(translationsContext);
};

export { getTranslationsContext, setTranslationsContext };
