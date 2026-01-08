import { assertNonNullish } from '@/shared/helpers/assertNonNullish';
import { RendererEvent } from '@pomello-desktop/domain';
import { PomelloService } from '@tinynudge/pomello-service';
import { ParentComponent, createContext, createEffect, onCleanup, useContext } from 'solid-js';

type PomelloProviderProps = {
  defaultService: PomelloService;
};

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
  createEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (import.meta.env.MODE !== 'test' && event.origin !== window.location.origin) {
        return;
      }

      if (
        event.data &&
        typeof event.data === 'object' &&
        'type' in event.data &&
        event.data.type === RendererEvent.ReinitializePomelloService
      ) {
        props.defaultService.reset({
          ...event.data.payload,
          reinitialize: true,
        });
      }
    };

    window.addEventListener('message', handleMessage);

    onCleanup(() => {
      window.removeEventListener('message', handleMessage);
    });
  });

  return (
    <PomelloContext.Provider value={props.defaultService}>{props.children}</PomelloContext.Provider>
  );
};
