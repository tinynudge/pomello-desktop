import App from '@/app/App';
import { PomelloProvider } from '@/app/context/PomelloContext';
import createStore from '@/app/createStore';
import services from '@/services';
import { PomelloConfigProvider } from '@/shared/context/PomelloConfigContext';
import { TranslationsProvider } from '@/shared/context/TranslationsContext';
import getPomelloServiceConfig from '@/shared/helpers/getPomelloServiceConfig';
import createLogger from '@/__bootstrap__/createLogger';
import createPomelloService from '@/__bootstrap__/createPomelloService';
import setTheme from '@/__bootstrap__/setTheme';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Provider } from 'react-redux';

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
              <TranslationsProvider commonTranslations={translations}>
                <App hotkeys={hotkeys} logger={createLogger()} services={services} />
              </TranslationsProvider>
            </PomelloConfigProvider>
          </PomelloProvider>
        </QueryClientProvider>
      </Provider>
    </StrictMode>
  );

  // TODO: Don't show app until here
};

renderApp();
