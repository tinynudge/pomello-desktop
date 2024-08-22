import { createMockAppApi } from '@/__fixtures__/createMockAppApi';
import { createMockLogger } from '@/__fixtures__/createMockLogger';
import { PomelloApiResponses, createMockPomelloApi } from '@/__fixtures__/createMockPomelloApi';
import { createMockServiceFactory } from '@/__fixtures__/createMockService';
import { createMockServiceConfig } from '@/__fixtures__/createMockServiceConfig';
import { createMockSettings } from '@/__fixtures__/createMockSettings';
import { mockHotkeys } from '@/__fixtures__/mockHotkeys';
import { PomelloApiProvider } from '@/shared/context/PomelloApiContext';
import { RuntimeProvider } from '@/shared/context/RuntimeContext';
import { ServiceProvider } from '@/shared/context/ServiceContext';
import { bindContext } from '@/shared/helpers/bindContext';
import {
  LabeledHotkeys,
  PomelloServiceConfig,
  Service,
  ServiceConfigActions,
  ServiceConfigStore,
  ServiceFactory,
  ServiceRegistry,
  Settings,
} from '@pomello-desktop/domain';
import { render } from '@solidjs/testing-library';
import { QueryClient, QueryClientProvider } from '@tanstack/solid-query';
import userEvent from '@testing-library/user-event';
import translations from '../../../../../translations/main/en-US.json';
import { App } from '../components/App';
import { HotkeysProvider } from '../context/HotkeysContext';
import { PomelloProvider } from '../context/PomelloContext';
import { StoreProvider } from '../context/StoreContext';
import { createMockPomelloService } from './createMockPomelloService';
import { simulate } from './simulate';

export * from '@solidjs/testing-library';

export type RenderAppOptions = {
  appApi?: Partial<AppApi>;
  createServiceRegistry?(
    defaultRegistry: ServiceRegistry
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): Record<string, ServiceFactory<void> | ServiceFactory<any>>;
  hotkeys?: Partial<LabeledHotkeys>;
  mockService?: {
    config?: ServiceConfigStore;
    service?: Partial<Service>;
  };
  pomelloApi?: Partial<PomelloApiResponses>;
  pomelloConfig?: Partial<PomelloServiceConfig>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  serviceConfigs?: Record<string, ServiceConfigActions<any>>;
  serviceId?: string | null;
  settings?: Partial<Settings>;
};

export const renderApp = (options: RenderAppOptions = {}) => {
  const serviceId = options.serviceId === null ? undefined : options.serviceId ?? 'mock';

  const logger = createMockLogger();
  const settings = createMockSettings(options.settings);
  const pomelloService = createMockPomelloService(settings);
  const createMockService = createMockServiceFactory(options.mockService);

  const [pomelloConfig, pomelloConfigActions] = createMockServiceConfig<PomelloServiceConfig>(
    'pomello',
    {
      didPromptRegistration: true,
      token: 'MY_POMELLO_TOKEN',
      user: {
        email: 'thomas@tester.com',
        name: 'Thomas Tester',
        timezone: 'America/Chicago',
        type: 'premium',
      },
      ...options.pomelloConfig,
    }
  );

  const hotkeys: LabeledHotkeys = {
    ...mockHotkeys,
    ...options.hotkeys,
  };

  const [appApi, emitAppApiEvent] = createMockAppApi({
    appApi: options.appApi,
    hotkeys,
    serviceConfigs: {
      pomello: pomelloConfigActions,
      ...options.serviceConfigs,
    },
    settings,
  });

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: 0,
      },
    },
  });

  const defaultServiceRegistry: ServiceRegistry = {
    [createMockService.id]: createMockService,
  };

  const services =
    options.createServiceRegistry?.(defaultServiceRegistry) ?? defaultServiceRegistry;

  const pomelloApi = createMockPomelloApi(pomelloConfig, options.pomelloApi);

  render(() => (
    <QueryClientProvider client={queryClient}>
      <PomelloProvider defaultService={pomelloService}>
        <StoreProvider>
          <RuntimeProvider
            initialLogger={logger}
            initialPomelloConfig={pomelloConfig}
            initialServices={services as ServiceRegistry}
            initialSettings={settings}
            initialTranslations={translations}
          >
            <PomelloApiProvider initialPomelloApi={pomelloApi}>
              <ServiceProvider initialServiceId={serviceId}>
                <HotkeysProvider initialHotkeys={hotkeys}>
                  <App />
                </HotkeysProvider>
              </ServiceProvider>
            </PomelloApiProvider>
          </RuntimeProvider>
        </StoreProvider>
      </PomelloProvider>
    </QueryClientProvider>
  ));

  const result = {
    appApi,
    emitAppApiEvent,
    pomelloApi,
    userEvent: userEvent.setup(),
  };

  return {
    ...result,
    simulate: bindContext(simulate, result),
  };
};
