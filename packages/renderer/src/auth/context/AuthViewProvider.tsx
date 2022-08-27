import { createContext, FC, ReactNode } from 'react';

interface AuthViewProviderProps {
  children: ReactNode;
  onTokenSave(): void;
}

interface AuthViewContextValue {
  onTokenSave(): void;
}

export const AuthViewContext = createContext<AuthViewContextValue | undefined>(undefined);

const AuthViewProvider: FC<AuthViewProviderProps> = ({ children, onTokenSave }) => {
  return <AuthViewContext.Provider value={{ onTokenSave }}>{children}</AuthViewContext.Provider>;
};

export default AuthViewProvider;
