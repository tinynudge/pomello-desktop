import createMockAppApi from '@/__fixtures__/createMockAppApi';
import createMockLogger from '@/__fixtures__/createMockLogger';
import createMockServiceFactory from '@/__fixtures__/createMockService';
import createMockSettings from '@/__fixtures__/createMockSettings';
import mockHotkeys from '@/__fixtures__/mockHotkeys';
import mockRegisterServiceConfig from '@/__fixtures__/mockRegisterServiceConfig';
import bindContext from '@/shared/helpers/bindContext';
import type {
  LabeledHotkeys,
  PomelloServiceConfig,
  Service,
  ServiceConfigStore,
  ServiceRegistry,
  Settings,
} from '@domain';
import { render } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import translations from '../../../../translations/en-US.json';
import App from '../App.svelte';
import createMockPomelloService from './createMockPomelloService';
import simulate from './simulate';

export * from '@testing-library/svelte';

export type MountAppResults = ReturnType<typeof mountAppBase>;

export interface MountAppOptions {
  appApi?: Partial<AppApi>;
  createServiceRegistry?(defaultRegistry: ServiceRegistry): ServiceRegistry;
  hotkeys?: Partial<LabeledHotkeys>;
  initialServiceId?: string | null;
  mockService?: {
    config?: ServiceConfigStore;
    service?: Partial<Service>;
  };
  pomelloServiceConfig?: Partial<PomelloServiceConfig>;
  serviceConfigs?: Record<string, ServiceConfigStore<unknown>>;
  settings?: Partial<Settings>;
}

const defaultPomelloServiceConfig: PomelloServiceConfig = {
  didPromptRegistration: true,
  token: 'MY_POMELLO_TOKEN',
  user: {
    email: 'thomas@tester.com',
    name: 'Thomas Tester',
    timezone: 'America/Chicago',
    type: 'premium',
  },
};

const mountAppBase = (options: MountAppOptions = {}) => {
  const initialServiceId = options.initialServiceId ?? 'mock';

  const logger = createMockLogger();

  const settings = createMockSettings(options.settings);
  const pomelloService = createMockPomelloService(settings);

  const pomelloServiceConfig = mockRegisterServiceConfig('pomello', {
    ...defaultPomelloServiceConfig,
    ...options.pomelloServiceConfig,
  });

  const [appApi, emitAppApiEvent] = createMockAppApi({
    appApi: options.appApi,
    serviceConfigs: {
      pomello: pomelloServiceConfig,
      ...options.serviceConfigs,
    },
    settings,
  });
  window.app = appApi;

  const mockServiceFactory = createMockServiceFactory(options.mockService);

  const defaultServices: ServiceRegistry = {
    [mockServiceFactory.id]: mockServiceFactory,
  };

  const services = options.createServiceRegistry?.(defaultServices) ?? defaultServices;

  const hotkeys: LabeledHotkeys = {
    ...mockHotkeys,
    ...options.hotkeys,
  };

  render(App, {
    hotkeys,
    initialServiceId: options.initialServiceId === null ? undefined : initialServiceId,
    logger,
    pomelloService,
    pomelloServiceConfig,
    services,
    settings,
    translations,
  });

  return {
    appApi,
    emitAppApiEvent,
    userEvent: userEvent.setup(),
  };
};

const mountApp = (options?: MountAppOptions) => {
  const results = mountAppBase(options);

  return {
    ...results,
    simulate: bindContext(simulate, results),
  };
};

export default mountApp;
