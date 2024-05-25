import { Translate, Translations, TranslationsDictionary } from '@pomello-desktop/domain';
import { createStore, produce } from 'solid-js/store';
import { useRuntime } from './RuntimeContext';

export type RuntimeTranslations = {
  addNamespace(namespace: string, translations: TranslationsDictionary): void;
  removeNamespace(namespace: string): void;
  t(namespacedKey: string, mappings?: Record<string, string>): string;
};

export const useTranslate = (): Translate => {
  const runtime = useRuntime();

  return runtime.translations.t;
};

export const createRuntimeTranslations = (
  commonTranslations: TranslationsDictionary
): RuntimeTranslations => {
  const [translations, setTranslations] = createStore<Translations>({
    common: commonTranslations,
  });

  const addNamespace = (namespace: string, translations: TranslationsDictionary) => {
    setTranslations(
      produce(previousTranslations => {
        previousTranslations[namespace] = translations;
      })
    );
  };

  const removeNamespace = (namespace: string) => {
    setTranslations(
      produce(translations => {
        delete translations[namespace];
      })
    );
  };

  const translate = (namespacedKey: string, mappings?: Record<string, string>) => {
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
  };

  return {
    addNamespace,
    removeNamespace,
    t: translate,
  };
};
