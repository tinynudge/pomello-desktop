import { assertNonNullish } from '@/shared/helpers/assertNonNullish';
import { ParentComponent, createContext, useContext } from 'solid-js';

interface AuthViewProviderProps {
  defaultOnTokenSave(): void;
}

interface AuthViewContextValue {
  onTokenSave(): void;
}

const AuthViewContext = createContext<AuthViewContextValue | undefined>(undefined);

export const useAuthView = () => {
  const context = useContext(AuthViewContext);

  assertNonNullish(context, 'useAuthView must be used inside <AuthViewProvider>');

  return context;
};

export const AuthViewProvider: ParentComponent<AuthViewProviderProps> = props => {
  return (
    <AuthViewContext.Provider
      value={{
        onTokenSave: props.defaultOnTokenSave,
      }}
    >
      {props.children}
    </AuthViewContext.Provider>
  );
};
