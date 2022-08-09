import { DialAction } from '@domain';
import { createContext, FC, ReactNode, useCallback, useMemo, useState } from 'react';

interface DialActionsProviderProps {
  children: ReactNode;
}

interface DialActionsContextValue {
  dialActions: DialAction[];
  registerDialActions(actions: DialAction[]): UnregisterDialActions;
}

type UnregisterDialActions = () => void;

export const DialActionsContext = createContext<DialActionsContextValue | undefined>(undefined);

export const DialActionsProvider: FC<DialActionsProviderProps> = ({ children }) => {
  const [dialActions, setDialActions] = useState<DialAction[]>([]);

  const registerDialActions = useCallback((dialActions: DialAction[]) => {
    setDialActions(dialActions);

    return () => {
      setDialActions([]);
    };
  }, []);

  const context = useMemo(
    () => ({
      dialActions,
      registerDialActions,
    }),
    [dialActions, registerDialActions]
  );

  return <DialActionsContext.Provider value={context}>{children}</DialActionsContext.Provider>;
};
