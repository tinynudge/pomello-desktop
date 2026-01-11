import { createMockAppApi } from '@/__fixtures__/createMockAppApi';
import { createMockLogger } from '@/__fixtures__/createMockLogger';
import { createMockServiceFactory } from '@/__fixtures__/createMockService';
import { createMockServiceConfig } from '@/__fixtures__/createMockServiceConfig';
import { createMockSettings } from '@/__fixtures__/createMockSettings';
import { mockHotkeys } from '@/__fixtures__/mockHotkeys';
import { RuntimeProvider } from '@/shared/context/RuntimeContext';
import {
  DashboardRoute,
  FormattedHotkeys,
  PomelloServiceConfig,
  ServiceConfigActions,
  ServiceFactory,
  ServiceRegistry,
  Settings,
} from '@pomello-desktop/domain';
import { MemoryRouter, createMemoryHistory } from '@solidjs/router';
import { render } from '@solidjs/testing-library';
import userEvent from '@testing-library/user-event';
import dashboardTranslations from '../../../../../translations/dashboard/en-US.json';
import sharedTranslations from '../../../../../translations/shared/en-US.json';
import { Layout } from '../components/Layout';
import { Routes } from '../components/Routes';
import { DashboardProvider } from '../context/DashboardContext';

export * from '@solidjs/testing-library';

type RenderDashboardOptions = {
  appApi?: Partial<AppApi>;
  hotkeys?: FormattedHotkeys;
  pomelloConfig?: Partial<PomelloServiceConfig>;
  route?: DashboardRoute;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  serviceConfigs?: Record<string, ServiceConfigActions<any>>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  services?: ServiceFactory[] | ServiceFactory<any>[];
  settings?: Partial<Settings>;
};

export const renderDashboard = (options: RenderDashboardOptions = {}) => {
  const logger = createMockLogger();
  const settings = createMockSettings(options.settings);
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

  const hotkeys: FormattedHotkeys = {
    ...mockHotkeys,
    ...options.hotkeys,
  };

  const [appApi, emitAppApiEvent] = createMockAppApi({
    appApi: options.appApi,
    serviceConfigs: {
      pomello: pomelloConfigActions,
      ...options.serviceConfigs,
    },
    settings,
  });

  const serviceRegistry: ServiceRegistry = {};
  const services = options.services ?? [createMockServiceFactory()];

  services.forEach(serviceFactory => {
    serviceRegistry[serviceFactory.id] = serviceFactory as ServiceFactory;
  });

  const history = createMemoryHistory();

  history.set({
    value: `/${options.route ?? DashboardRoute.Productivity}`,
  });

  const result = render(() => (
    <RuntimeProvider
      initialLogger={logger}
      initialPomelloConfig={pomelloConfig}
      initialServices={serviceRegistry}
      initialSettings={settings}
      initialTranslations={{ ...sharedTranslations, ...dashboardTranslations }}
    >
      <DashboardProvider initialDefaultHotkeys={mockHotkeys} initialHotkeys={hotkeys}>
        <MemoryRouter history={history} root={Layout}>
          <Routes />
        </MemoryRouter>
      </DashboardProvider>
    </RuntimeProvider>
  ));

  return {
    appApi,
    emitAppApiEvent,
    pomelloConfig,
    result,
    userEvent: userEvent.setup(),
  };
};
