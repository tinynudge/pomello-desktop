import { Translations } from '@domain';
import { createContext, FC, ReactNode } from 'react';

interface TranslationsProviderProps {
  children: ReactNode;
  translations: Translations;
}

export const TranslationsContext = createContext<Translations | undefined>(undefined);

export const TranslationsProvider: FC<TranslationsProviderProps> = ({ children, translations }) => {
  return (
    <TranslationsContext.Provider value={translations}>{children}</TranslationsContext.Provider>
  );
};
