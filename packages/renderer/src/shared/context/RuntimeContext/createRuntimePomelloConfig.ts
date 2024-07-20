import { PomelloServiceConfig, PomelloUser, ServiceConfig } from '@pomello-desktop/domain';
import { onCleanup } from 'solid-js';
import { createStore, reconcile } from 'solid-js/store';
import { useRuntime } from './RuntimeContext';

export type RuntimePomelloConfig = {
  actions: PomelloConfigActions;
  store: PomelloServiceConfig;
};

type PomelloConfigActions = {
  registrationPromptHandled(): void;
  tokenUpdated(token: string): void;
  userFetched(user: PomelloUser): void;
  userInvalidated(): void;
};

export const usePomelloConfig = (): RuntimePomelloConfig => {
  const runtime = useRuntime();

  return runtime.pomelloConfig;
};

export const createRuntimePomelloConfig = (
  initialPomelloConfig: ServiceConfig<PomelloServiceConfig>
): RuntimePomelloConfig => {
  const [pomelloConfig, setPomelloConfig] = createStore<PomelloServiceConfig>(
    initialPomelloConfig.get()
  );

  const unsubscribe = initialPomelloConfig.onChange(pomelloConfig => {
    setPomelloConfig(reconcile(pomelloConfig));
  });

  onCleanup(unsubscribe);

  const actions: PomelloConfigActions = {
    registrationPromptHandled: () => {
      initialPomelloConfig.set('didPromptRegistration', true);
    },
    tokenUpdated: token => {
      initialPomelloConfig.set('token', token);
    },
    userFetched: user => {
      initialPomelloConfig.set('user', user);
    },
    userInvalidated: () => {
      initialPomelloConfig.unset('token');
      initialPomelloConfig.unset('user');
    },
  };

  return {
    actions,
    store: pomelloConfig,
  };
};
