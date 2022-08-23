import { Translations, TranslationsDictionary } from '@domain';
import produce from 'immer';
import { createContext, FC, ReactNode, useCallback, useEffect, useState } from 'react';

interface TranslationsProviderProps {
  children: ReactNode;
  commonTranslations: TranslationsDictionary;
}

interface TranslationsContextValue {
  addNamespace(namespace: string, translations: TranslationsDictionary): void;
  removeNamespace(namespace: string): void;
  translations: Translations;
}

export const TranslationsContext = createContext<TranslationsContextValue | undefined>(undefined);

export const TranslationsProvider: FC<TranslationsProviderProps> = ({
  children,
  commonTranslations,
}) => {
  const [translations, setTranslations] = useState<Translations>({ common: commonTranslations });

  useEffect(() => {
    setTranslations(previousTranslations => ({
      ...previousTranslations,
      common: commonTranslations,
    }));
  }, [commonTranslations]);

  const addNamespace = useCallback((namespace: string, translations: TranslationsDictionary) => {
    setTranslations(previousTranslations => ({
      ...previousTranslations,
      [namespace]: translations,
    }));
  }, []);

  const removeNamespace = useCallback((namespace: string) => {
    setTranslations(
      produce(draft => {
        delete draft[namespace];
      })
    );
  }, []);

  return (
    <TranslationsContext.Provider value={{ addNamespace, removeNamespace, translations }}>
      {children}
    </TranslationsContext.Provider>
  );
};
