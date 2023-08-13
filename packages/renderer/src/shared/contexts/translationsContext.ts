import type { Translations, TranslationsDictionary } from '@domain';
import { getContext, setContext } from 'svelte';

const translationsContext = 'translations';

const setTranslationsContext = (commonTranslations: TranslationsDictionary) => {
  const translations = { common: commonTranslations };

  setContext(translationsContext, translations);
};

const getTranslationsContext = (): Translations => {
  return getContext(translationsContext);
};

export { getTranslationsContext, setTranslationsContext };
