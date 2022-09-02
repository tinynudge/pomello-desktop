import { TranslationsProvider } from '@/shared/context/TranslationsContext';
import createMockAppApi from '@/__fixtures__/createMockAppApi';
import createMockServiceFactory from '@/__fixtures__/createMockService';
import createMockSettings from '@/__fixtures__/createMockSettings';
import mockHotkeys from '@/__fixtures__/mockHotkeys';
import { Hotkeys, Service, ServiceConfigStore, ServiceRegistry, Settings } from '@domain';
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
  createServiceRegistry?(defaultRegistry: ServiceRegistry): ServiceRegistry;
  hotkeys?: Partial<Hotkeys>;
  mockService?: {
    config?: ServiceConfigStore;
    service?: Partial<Service>;
  };
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
        suspense: true,
        staleTime: Infinity, // https://github.com/TanStack/query/issues/270
      },
    },
  });

  const defaultServices: ServiceRegistry = {
    [mockServiceFactory.id]: mockServiceFactory,
  };

  const services = options.createServiceRegistry?.(defaultServices) ?? defaultServices;

  render(
    <Provider store={store}>
      <PomelloProvider service={pomelloService}>
        <QueryClientProvider client={queryClient}>
          <TranslationsProvider commonTranslations={translations}>
            <App hotkeys={mockHotkeys} services={services} />
          </TranslationsProvider>
        </QueryClientProvider>
      </PomelloProvider>
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
