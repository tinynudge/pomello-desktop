import { PomelloConfigProvider } from '@/shared/context/PomelloConfigContext';
import { TranslationsProvider } from '@/shared/context/TranslationsContext';
import createMockAppApi from '@/__fixtures__/createMockAppApi';
import createMockServiceFactory from '@/__fixtures__/createMockService';
import createMockServiceConfig from '@/__fixtures__/createMockServiceConfig';
import createMockSettings from '@/__fixtures__/createMockSettings';
import mockHotkeys from '@/__fixtures__/mockHotkeys';
import mockRegisterServiceConfig from '@/__fixtures__/mockRegisterServiceConfig';
import {
  Hotkeys,
  PomelloServiceConfig,
  Service,
  ServiceConfigStore,
  ServiceFactory,
  ServiceRegistry,
  Settings,
} from '@domain';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Provider } from 'react-redux';
import translations from '../../../../translations/en-US.json';
import App from '../App';
import { PomelloProvider } from '../context/PomelloContext';
import createStore from '../createStore';
import bindContext from './bindContext';
import createMockPomelloService from './createMockPomelloService';
import simulate from './simulate';

export * from '@testing-library/react';

export type MountAppResults = ReturnType<typeof mountApp>;

interface MountAppOptions {
  appApi?: Partial<AppApi>;
  createServiceRegistry?(
    defaultRegistry: ServiceRegistry
  ): Record<string, ServiceFactory<void> | ServiceFactory<any>>;
  hotkeys?: Partial<Hotkeys>;
  mockService?: {
    config?: ServiceConfigStore;
    service?: Partial<Service>;
  };
  pomelloConfig?: Partial<PomelloServiceConfig>;
  serviceId?: string | null;
  settings?: Partial<Settings>;
}

const mountApp = (options: MountAppOptions = {}) => {
  const serviceId = options.serviceId ?? 'mock';

  const settings = createMockSettings(options.settings);
  const mockServiceFactory = createMockServiceFactory(options.mockService);

  const pomelloService = createMockPomelloService(settings);
  const [appApi, emitAppApiEvent] = createMockAppApi(options.appApi, settings);
  window.app = appApi;

  const store = createStore({
    pomelloState: pomelloService.getState(),
    serviceId: options.serviceId !== null ? serviceId : undefined,
    settings,
  });

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: 0,
        staleTime: Infinity, // https://github.com/TanStack/query/issues/270
        useErrorBoundary: true,
      },
    },
  });

  const defaultServices: ServiceRegistry = {
    [mockServiceFactory.id]: mockServiceFactory,
  };

  const services = options.createServiceRegistry?.(defaultServices) ?? defaultServices;

  const pomelloConfig = createMockServiceConfig(
    mockRegisterServiceConfig<PomelloServiceConfig>('pomello', {
      didPromptRegistration: true,
      token: 'MY_POMELLO_TOKEN',
      ...options.pomelloConfig,
    })
  );

  render(
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <PomelloProvider service={pomelloService}>
          <PomelloConfigProvider config={pomelloConfig}>
            <TranslationsProvider commonTranslations={translations}>
              <App hotkeys={mockHotkeys} services={services as ServiceRegistry} />
            </TranslationsProvider>
          </PomelloConfigProvider>
        </PomelloProvider>
      </QueryClientProvider>
    </Provider>
  );

  return {
    appApi,
    emitAppApiEvent,
    userEvent: userEvent.setup(),
  };
};

const mountAppWithSimulator = (options?: MountAppOptions) => {
  const results = mountApp(options);

  return {
    ...results,
    simulate: bindContext(simulate, results),
  };
};

export default mountAppWithSimulator;
