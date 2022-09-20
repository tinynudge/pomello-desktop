import { Translate, TranslationsDictionary } from '@domain';
import { useCallback, useContext } from 'react';
import { TranslationsContext } from '../context/TranslationsContext';
import assertNonNullish from '../helpers/assertNonNullish';

interface UseTranslation {
  addNamespace(namespace: string, translations: TranslationsDictionary): void;
  removeNamespace(namespace: string): void;
  t: Translate;
}

const useTranslation = (): UseTranslation => {
  const context = useContext(TranslationsContext);

  assertNonNullish(context, 'useTranslation must be used inside a <TranslationsProvider>');

  const { addNamespace, removeNamespace, translations } = context;

  const t: Translate = useCallback(
    (namespacedKey, mappings) => {
      let [namespace, key] = namespacedKey.split(':');
      if (!key) {
        key = namespace;
        namespace = 'common';
      }

      const translation = translations[namespace]?.[key];

      if (!translation) {
        return key;
      }

      return mappings
        ? translation.replace(/\{\{(\w+)\}\}/gm, (_match, mapping) => mappings[mapping] ?? mapping)
        : translation;
    },
    [translations]
  );

  return { addNamespace, removeNamespace, t };
};

export default useTranslation;
