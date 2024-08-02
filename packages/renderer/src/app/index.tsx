import { createLogger } from '@/__bootstrap__/createLogger';
import { createPomelloService } from '@/__bootstrap__/createPomelloService';
import { setTheme } from '@/__bootstrap__/setTheme';
import { services } from '@/services';
import { PomelloApiProvider } from '@/shared/context/PomelloApiContext';
import { RuntimeProvider } from '@/shared/context/RuntimeContext';
import { ServiceProvider } from '@/shared/context/ServiceContext';
import { createPomelloApi } from '@/shared/helpers/createPomelloApi';
import { getPomelloServiceConfig } from '@/shared/helpers/getPomelloServiceConfig';
import { QueryClient, QueryClientProvider, focusManager } from '@tanstack/solid-query';
import { render } from 'solid-js/web';
import { App } from './components/App';
import { HotkeysProvider } from './context/HotkeysContext';
import { PomelloProvider } from './context/PomelloContext';
import { StoreProvider } from './context/StoreContext';

const renderApp = async () => {
  const queryClient = new QueryClient();

  focusManager.setEventListener(handleFocus => {
    return window.app.onAppWindowFocus(handleFocus);
  });

  const container = document.getElementById('root');

  if (!container) {
    throw new Error('Unable to find container with id "root"');
  }

  const [hotkeys, themeCss, translations, pomelloConfig, serviceId, settings] = await Promise.all([
    window.app.getHotkeys(),
    window.app.getThemeCss(),
    window.app.getTranslations('main'),
    getPomelloServiceConfig(),
    window.app.getActiveServiceId(),
    window.app.getSettings(),
  ]);

  const pomelloApi = createPomelloApi(pomelloConfig);
  const pomelloService = createPomelloService(settings);
  const logger = createLogger();

  setTheme(themeCss);

  render(
    () => (
      <QueryClientProvider client={queryClient}>
        <PomelloProvider defaultService={pomelloService}>
          <StoreProvider>
            <RuntimeProvider
              initialLogger={logger}
              initialPomelloConfig={pomelloConfig}
              initialServices={services}
              initialSettings={settings}
              initialTranslations={translations}
            >
              <PomelloApiProvider initialPomelloApi={pomelloApi}>
                <ServiceProvider initialServiceId={serviceId}>
                  <HotkeysProvider hotkeys={hotkeys}>
                    <App />
                  </HotkeysProvider>
                </ServiceProvider>
              </PomelloApiProvider>
            </RuntimeProvider>
          </StoreProvider>
        </PomelloProvider>
      </QueryClientProvider>
    ),
    container
  );
};

renderApp();
