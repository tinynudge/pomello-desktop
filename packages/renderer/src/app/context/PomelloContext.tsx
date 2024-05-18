import { assertNonNullish } from '@/shared/helpers/assertNonNullish';
import { PomelloService } from '@tinynudge/pomello-service';
import { ParentComponent, createContext, useContext } from 'solid-js';

interface PomelloProviderProps {
  defaultService: PomelloService;
}

const PomelloContext = createContext<PomelloService | undefined>(undefined);

export const usePomelloService = (): PomelloService => {
  const context = useContext(PomelloContext);

  assertNonNullish(context, 'usePomelloService must be used inside <PomelloProvider>');

  return context;
};

export const usePomelloActions = () => {
  const context = useContext(PomelloContext);

  assertNonNullish(context, 'usePomelloActions must be used inside <PomelloProvider>');

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { getState, on, off, ...actions } = context;

  return actions;
};

export const PomelloProvider: ParentComponent<PomelloProviderProps> = props => {
  return (
    <PomelloContext.Provider value={props.defaultService}>{props.children}</PomelloContext.Provider>
  );
};
