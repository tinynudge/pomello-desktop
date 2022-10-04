import { TranslationsProvider } from '@/shared/context/TranslationsContext';
import createMockAppApi from '@/__fixtures__/createMockAppApi';
import createMockServiceFactory from '@/__fixtures__/createMockService';
import createMockSettings from '@/__fixtures__/createMockSettings';
import { AuthWindowType, Service, ServiceRegistry, Settings } from '@domain';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import translations from '../../../../translations/en-US.json';
import Auth from '../Auth';

export * from '@testing-library/react';

interface MountAuthOptions {
  authWindow?: AuthWindowType;
  appApi?: Partial<AppApi>;
  service?: Partial<Service>;
  serviceId?: string;
  settings?: Partial<Settings>;
}

const mountAuth = (options: MountAuthOptions = {}) => {
  const settings = createMockSettings(options.settings);
  const mockServiceFactory = createMockServiceFactory({ service: options.service });

  const [appApi, emitAppApiEvent] = createMockAppApi(options.appApi, settings);
  window.app = appApi;

  const services: ServiceRegistry = {
    [mockServiceFactory.id]: mockServiceFactory,
  };

  const authWindow = options.authWindow ?? { type: 'service', serviceId: mockServiceFactory.id };

  const result = render(
    <TranslationsProvider commonTranslations={translations}>
      <Auth authWindow={authWindow} services={services} />
    </TranslationsProvider>
  );

  return {
    appApi,
    emitAppApiEvent,
    result,
    userEvent: userEvent.setup(),
  };
};

export default mountAuth;
