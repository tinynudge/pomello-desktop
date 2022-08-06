import { DialAction } from '@domain';
import { createContext, FC, ReactNode, useCallback, useMemo, useState } from 'react';

interface DialActionsProviderProps {
  children: ReactNode;
}

interface DialActionsContextValue {
  dialActions: DialAction[];
  setDialActions(actions: DialAction[]): void;
  unsetDialActions(): void;
}

export const DialActionsContext = createContext<DialActionsContextValue | undefined>(undefined);

export const DialActionsProvider: FC<DialActionsProviderProps> = ({ children }) => {
  const [dialActions, setDialActions] = useState<DialAction[]>([]);

  const unsetDialActions = useCallback(() => {
    setDialActions([]);
  }, []);

  const context = useMemo(
    () => ({
      dialActions,
      setDialActions,
      unsetDialActions,
    }),
    [dialActions, unsetDialActions]
  );

  return <DialActionsContext.Provider value={context}>{children}</DialActionsContext.Provider>;
};
