import { TranslationsDictionary } from '@domain';

const createTranslator = (translations: TranslationsDictionary) => {
  return (key: string, mappings?: Record<string, string>) => {
    const translation = translations[key];

    if (!translation) {
      return key;
    }

    return mappings
      ? translation.replace(/\{\{(\w+)\}\}/gm, (_match, mapping) => mappings[mapping] ?? mapping)
      : translation;
  };
};

export default createTranslator;
