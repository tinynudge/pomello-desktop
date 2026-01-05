import { assertNonNullish } from '@/shared/helpers/assertNonNullish';
import { ServiceContainer } from '@pomello-desktop/domain';
import { createContext, createEffect, useContext } from 'solid-js';
import { TrelloRuntime } from './domain';

type TrelloRuntimeProviderProps = ServiceContainer<{
  defaultRuntime: TrelloRuntime;
}>;

const TrelloRuntimeContext = createContext<TrelloRuntime | undefined>(undefined);

export const useTrelloCache = (): TrelloRuntime['cache'] => {
  const runtime = useContext(TrelloRuntimeContext);

  assertNonNullish(runtime, 'useTrelloCache must be used inside <TrelloRuntimeProvider>');

  return runtime.cache;
};

export const useTrelloConfig = (): TrelloRuntime['config'] => {
  const runtime = useContext(TrelloRuntimeContext);

  assertNonNullish(runtime, 'useTrelloConfig must be used inside <TrelloRuntimeProvider>');

  return runtime.config;
};

export const TrelloRuntimeProvider: TrelloRuntimeProviderProps = props => {
  createEffect(() => {
    const { config, reinitializePomelloService } = props.defaultRuntime;

    if (!config.store.currentList) {
      reinitializePomelloService();
    }
  });

  return (
    <TrelloRuntimeContext.Provider value={props.defaultRuntime}>
      {props.children}
    </TrelloRuntimeContext.Provider>
  );
};
