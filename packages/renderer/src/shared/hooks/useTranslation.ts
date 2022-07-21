import { useCallback, useContext } from 'react';
import { TranslationsContext } from '../context/TranslationsContext';

interface UseTranslation {
  t: Translate;
}

type Translate = (input: string, mappings?: Record<string, string>) => string;

const useTranslation = (): UseTranslation => {
  const dictionary = useContext(TranslationsContext);

  if (!dictionary) {
    throw new Error('useTranslation must be used inside a <TranslationsProvider>');
  }

  const t: Translate = useCallback(
    (key, mappings) => {
      const translation = dictionary[key];

      if (!translation) {
        return key;
      }

      return mappings
        ? translation.replace(/\{\{(\w+)\}\}/gm, (_match, mapping) => mappings[mapping] ?? mapping)
        : translation;
    },
    [dictionary]
  );

  return { t };
};

export default useTranslation;
