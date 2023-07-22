import type { Translate } from '@domain';
import { derived, type Readable } from 'svelte/store';
import { getTranslationsContext } from './translationsContext';

const getTranslator = (): Readable<Translate> => {
  const { translations } = getTranslationsContext();

  return derived(translations, $translations => {
    return (namespacedKey: string, mappings?: Record<string, string>) => {
      let [namespace, key] = namespacedKey.split(':');

      if (!key) {
        key = namespace;
        namespace = 'common';
      }

      const translation = $translations[namespace]?.[key];

      if (!translation) {
        return key;
      }

      if (mappings) {
        return translation.replace(
          /\{\{(\w+)\}\}/gm,
          (_match, mapping) => mappings[mapping] ?? mapping
        );
      }

      return translation;
    };
  });
};

export default getTranslator;
