import createLogger from '@/__bootstrap__/createLogger';
import createPomelloService from '@/__bootstrap__/createPomelloService';
import setTheme from '@/__bootstrap__/setTheme';
import { PomelloProvider } from '@/app/context/PomelloContext';
import createStore from '@/app/createStore';
import services from '@/services';
import { PomelloApiProvider } from '@/shared/context/PomelloApiContext';
import { PomelloConfigProvider } from '@/shared/context/PomelloConfigContext';
import { TranslationsProvider } from '@/shared/context/TranslationsContext';
import createPomelloApi from '@/shared/helpers/createPomelloApi';
import getPomelloServiceConfig from '@/shared/helpers/getPomelloServiceConfig';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Provider } from 'react-redux';
import App from './components/App';
import { HotkeysProvider } from './context/HotkeysContext';

const renderApp = async () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        useErrorBoundary: true,
      },
    },
  });

  const container = document.getElementById('root');

  if (!container) {
    throw new Error('Unable to find container with id "root"');
  }

  const [hotkeys, themeCss, translations, pomelloConfig, serviceId, settings] = await Promise.all([
    window.app.getHotkeys(),
    window.app.getThemeCss(),
    window.app.getTranslations(),
    getPomelloServiceConfig(),
    window.app.getActiveServiceId(),
    window.app.getSettings(),
  ]);

  const pomelloService = createPomelloService(settings);

  const store = createStore({
    pomelloState: pomelloService.getState(),
    serviceId,
    settings,
  });

  setTheme(themeCss);

  createRoot(container).render(
    <StrictMode>
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <PomelloProvider service={pomelloService}>
            <PomelloConfigProvider config={pomelloConfig}>
              <PomelloApiProvider pomelloApi={createPomelloApi(pomelloConfig)}>
                <TranslationsProvider commonTranslations={translations}>
                  <HotkeysProvider hotkeys={hotkeys}>
                    <App logger={createLogger()} services={services} />
                  </HotkeysProvider>
                </TranslationsProvider>
              </PomelloApiProvider>
            </PomelloConfigProvider>
          </PomelloProvider>
        </QueryClientProvider>
      </Provider>
    </StrictMode>
  );

  // TODO: Don't show app until here
};

renderApp();
