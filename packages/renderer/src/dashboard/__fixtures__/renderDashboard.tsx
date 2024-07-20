import { createMockAppApi } from '@/__fixtures__/createMockAppApi';
import { createMockLogger } from '@/__fixtures__/createMockLogger';
import { createMockServiceFactory } from '@/__fixtures__/createMockService';
import { createMockServiceConfig } from '@/__fixtures__/createMockServiceConfig';
import { createMockSettings } from '@/__fixtures__/createMockSettings';
import { RuntimeProvider } from '@/shared/context/RuntimeContext';
import {
  DashboardRoute,
  PomelloServiceConfig,
  Service,
  ServiceRegistry,
  Settings,
} from '@pomello-desktop/domain';
import { MemoryRouter, createMemoryHistory } from '@solidjs/router';
import { render } from '@solidjs/testing-library';
import userEvent from '@testing-library/user-event';
import translations from '../../../../../translations/en-US.json';
import { Layout } from '../components/Layout';
import { Routes } from '../components/Routes';

export * from '@solidjs/testing-library';

interface RenderDashboardOptions {
  appApi?: Partial<AppApi>;
  pomelloConfig?: Partial<PomelloServiceConfig>;
  route?: DashboardRoute;
  service?: Partial<Service>;
  settings?: Partial<Settings>;
}

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
      <MemoryRouter history={history} root={Layout}>
        <Routes />
      </MemoryRouter>
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
