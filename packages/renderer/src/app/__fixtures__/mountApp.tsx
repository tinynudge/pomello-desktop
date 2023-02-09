import { PomelloApiProvider } from '@/shared/context/PomelloApiContext';
import { PomelloConfigProvider } from '@/shared/context/PomelloConfigContext';
import { TranslationsProvider } from '@/shared/context/TranslationsContext';
import bindContext from '@/shared/helpers/bindContext';
import createPomelloApi from '@/shared/helpers/createPomelloApi';
import createMockAppApi from '@/__fixtures__/createMockAppApi';
import createMockLogger from '@/__fixtures__/createMockLogger';
import createMockServiceFactory from '@/__fixtures__/createMockService';
import createMockServiceConfig from '@/__fixtures__/createMockServiceConfig';
import createMockSettings from '@/__fixtures__/createMockSettings';
import createRestResolver from '@/__fixtures__/createRestResolver';
import mockHotkeys from '@/__fixtures__/mockHotkeys';
import mockRegisterServiceConfig from '@/__fixtures__/mockRegisterServiceConfig';
import mockServer from '@/__fixtures__/mockServer';
import {
  LabeledHotkeys,
  PomelloApiResponse,
  PomelloServiceConfig,
  PomelloUser,
  Service,
  ServiceConfigActions,
  ServiceConfigStore,
  ServiceFactory,
  ServiceRegistry,
  Settings,
} from '@domain';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ResponseResolver, rest, RestContext, RestRequest } from 'msw';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Provider } from 'react-redux';
import translations from '../../../../translations/en-US.json';
import App from '../components/App';
import { PomelloProvider } from '../context/PomelloContext';
import createStore from '../createStore';
import createMockPomelloService from './createMockPomelloService';
import generatePomelloUser from './generatePomelloUser';
import simulate from './simulate';

export * from '@testing-library/react';

export type MountAppResults = ReturnType<typeof mountApp>;

export interface MountAppOptions {
  appApi?: Partial<AppApi>;
  createServiceRegistry?(
    defaultRegistry: ServiceRegistry
  ): Record<string, ServiceFactory<void> | ServiceFactory<any>>;
  hotkeys?: Partial<LabeledHotkeys>;
  mockService?: {
    config?: ServiceConfigStore;
    service?: Partial<Service>;
  };
  pomelloApi?: Partial<PomelloApiResponses>;
  pomelloConfig?: Partial<PomelloServiceConfig>;
  serviceConfigs?: Record<string, ServiceConfigActions<any>>;
  serviceId?: string | null;
  settings?: Partial<Settings>;
}

interface PomelloApiResponses {
  fetchUser:
    | PomelloApiResponse<PomelloUser>
    | ResponseResolver<RestRequest, RestContext, PomelloApiResponse<PomelloUser>>;
}

const mountApp = (options: MountAppOptions = {}) => {
  const serviceId = options.serviceId ?? 'mock';

  const settings = createMockSettings(options.settings);
  const mockServiceFactory = createMockServiceFactory(options.mockService);

  const pomelloService = createMockPomelloService(settings);

  const pomelloConfigActions = mockRegisterServiceConfig<PomelloServiceConfig>('pomello', {
    didPromptRegistration: true,
    token: 'MY_POMELLO_TOKEN',
    user: {
      email: 'thomas@tester.com',
      name: 'Thomas Tester',
      timezone: 'America/Chicago',
      type: 'premium',
    },
    ...options.pomelloConfig,
  });
  const pomelloConfig = createMockServiceConfig(pomelloConfigActions);

  const [appApi, emitAppApiEvent] = createMockAppApi({
    appApi: options.appApi,
    serviceConfigs: {
      pomello: pomelloConfigActions,
      ...options.serviceConfigs,
    },
    settings,
  });
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

  const hotkeys: LabeledHotkeys = {
    ...mockHotkeys,
    ...options.hotkeys,
  };

  mockServer.use(
    rest.get(
      `${import.meta.env.VITE_APP_URL}/api/users`,
      createRestResolver<PomelloApiResponse<PomelloUser>>(
        generatePomelloUser(),
        options.pomelloApi?.fetchUser
      )
    )
  );

  render(
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <PomelloProvider service={pomelloService}>
          <PomelloConfigProvider config={pomelloConfig}>
            <PomelloApiProvider pomelloApi={createPomelloApi(pomelloConfig)}>
              <TranslationsProvider commonTranslations={translations}>
                <App
                  hotkeys={hotkeys}
                  logger={createMockLogger()}
                  services={services as ServiceRegistry}
                />
              </TranslationsProvider>
            </PomelloApiProvider>
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
