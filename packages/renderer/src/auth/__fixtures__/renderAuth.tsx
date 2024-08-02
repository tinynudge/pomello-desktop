import { createMockAppApi } from '@/__fixtures__/createMockAppApi';
import { createMockLogger } from '@/__fixtures__/createMockLogger';
import { createMockServiceFactory } from '@/__fixtures__/createMockService';
import { createMockServiceConfig } from '@/__fixtures__/createMockServiceConfig';
import { createMockSettings } from '@/__fixtures__/createMockSettings';
import { RuntimeProvider } from '@/shared/context/RuntimeContext';
import { ServiceProvider } from '@/shared/context/ServiceContext';
import {
  AuthWindowType,
  PomelloServiceConfig,
  Service,
  ServiceRegistry,
  Settings,
} from '@pomello-desktop/domain';
import { render } from '@solidjs/testing-library';
import userEvent from '@testing-library/user-event';
import translations from '../../../../../translations/main/en-US.json';
import { Auth } from '../Auth';

export * from '@solidjs/testing-library';

type RenderAuthOptions = {
  authWindow?: AuthWindowType;
  appApi?: Partial<AppApi>;
  service?: Partial<Service>;
  serviceId?: string;
  settings?: Partial<Settings>;
};

export const renderAuth = (options: RenderAuthOptions = {}) => {
  const logger = createMockLogger();
  const mockServiceFactory = createMockServiceFactory({ service: options.service });
  const settings = createMockSettings(options.settings);
  const [pomelloConfig] = createMockServiceConfig<PomelloServiceConfig>('pomello', {});

  const [appApi, emitAppApiEvent] = createMockAppApi({
    appApi: options.appApi,
    settings,
  });

  const services: ServiceRegistry = {
    [mockServiceFactory.id]: mockServiceFactory,
  };

  const authWindow = options.authWindow ?? { type: 'service', serviceId: mockServiceFactory.id };
  const serviceId = authWindow.type === 'service' ? authWindow.serviceId : undefined;

  const result = render(() => (
    <RuntimeProvider
      initialLogger={logger}
      initialPomelloConfig={pomelloConfig}
      initialServices={services}
      initialSettings={settings}
      initialTranslations={translations}
    >
      <ServiceProvider freezeServiceId initialServiceId={serviceId}>
        <Auth authWindow={authWindow} />
      </ServiceProvider>
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
