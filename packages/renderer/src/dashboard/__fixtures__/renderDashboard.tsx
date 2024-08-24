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
  Service,
  ServiceRegistry,
  Settings,
} from '@pomello-desktop/domain';
import { MemoryRouter, createMemoryHistory } from '@solidjs/router';
import { render } from '@solidjs/testing-library';
import userEvent from '@testing-library/user-event';
import translations from '../../../../../translations/dashboard/en-US.json';
import { Layout } from '../components/Layout';
import { Routes } from '../components/Routes';
import { DashboardProvider } from '../context/DashboardContext';

export * from '@solidjs/testing-library';

type RenderDashboardOptions = {
  appApi?: Partial<AppApi>;
  hotkeys?: FormattedHotkeys;
  pomelloConfig?: Partial<PomelloServiceConfig>;
  route?: DashboardRoute;
  service?: Partial<Service>;
  settings?: Partial<Settings>;
};

export const renderDashboard = (options: RenderDashboardOptions = {}) => {
  const logger = createMockLogger();
  const mockServiceFactory = createMockServiceFactory({ service: options.service });
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
    },
    settings,
  });

  const services: ServiceRegistry = {
    [mockServiceFactory.id]: mockServiceFactory,
  };

  const history = createMemoryHistory();

  history.set({
    value: `/${options.route ?? 'productivity'}`,
  });

  const result = render(() => (
    <RuntimeProvider
      initialLogger={logger}
      initialPomelloConfig={pomelloConfig}
      initialServices={services}
      initialSettings={settings}
      initialTranslations={translations}
    >
      <DashboardProvider initialHotkeys={hotkeys}>
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
