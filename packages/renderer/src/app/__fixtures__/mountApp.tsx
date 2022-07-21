import { TranslationsProvider } from '@/shared/context/TranslationsContext';
import createMockAppApi from '@/__fixtures__/createMockAppApi';
import createMockService from '@/__fixtures__/createMockService';
import createMockSettings from '@/__fixtures__/createMockSettings';
import { Service, ServiceRegistry, Settings } from '@domain';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Provider } from 'react-redux';
import translations from '../../../../translations/en-US.json';
import App from '../App';
import { PomelloContextProvider } from '../context/PomelloContext';
import createStore from '../createStore';
import createMockPomelloService from './createMockPomelloService';

export * from '@testing-library/react';

interface MountAppOptions {
  appApi?: Partial<AppApi>;
  service?: Partial<Omit<Service, 'id'>>;
  serviceId?: string | null;
  settings?: Partial<Settings>;
}

const mountApp = (options: MountAppOptions = {}) => {
  const serviceId = options.serviceId !== null ? options.serviceId ?? 'mock' : undefined;

  const settings = createMockSettings(options.settings);
  const service = createMockService(options.service);

  const pomelloService = createMockPomelloService(settings);
  const [appApi, emitAppApiEvent] = createMockAppApi(options.appApi, settings);
  window.app = appApi;

  const store = createStore({
    pomelloState: pomelloService.getState(),
    serviceId,
  });

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        suspense: true,
      },
    },
  });

  const services: ServiceRegistry = {
    mock: () => service,
  };

  const result = render(
    <Provider store={store}>
      <PomelloContextProvider service={pomelloService}>
        <QueryClientProvider client={queryClient}>
          <TranslationsProvider translations={translations}>
            <App services={services} />
          </TranslationsProvider>
        </QueryClientProvider>
      </PomelloContextProvider>
    </Provider>
  );

  return {
    appApi,
    emitAppApiEvent,
    result,
    service,
    userEvent: userEvent.setup(),
  };
};

export default mountApp;
