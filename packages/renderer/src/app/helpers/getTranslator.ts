import { getTranslationsContext } from '@/shared/contexts/translationsContext';
import type { Translate } from '@domain';

const getTranslator = (): Translate => {
  const translations = getTranslationsContext();

  return (namespacedKey: string, mappings?: Record<string, string>) => {
    let [namespace, key] = namespacedKey.split(':');

    if (!key) {
      key = namespace;
      namespace = 'common';
    }

    const translation = translations[namespace]?.[key];

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
};

export default getTranslator;
