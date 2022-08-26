import App from '@/app/App';
import { PomelloProvider } from '@/app/context/PomelloContext';
import createStore from '@/app/createStore';
import services from '@/services';
import { TranslationsProvider } from '@/shared/context/TranslationsContext';
import createPomelloService from '@/__bootstrap__/createPomelloService';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Provider } from 'react-redux';

const renderApp = async () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        suspense: true,
      },
    },
  });

  const container = document.getElementById('root');

  if (!container) {
    throw new Error('Unable to find container with id "root"');
  }

  const [pomelloService, hotkeys, themeCss, translations, serviceId] = await Promise.all([
    createPomelloService(),
    window.app.getHotkeys(),
    window.app.getThemeCss(),
    window.app.getTranslations(),
    window.app.getActiveServiceId(),
  ]);

  const store = createStore({
    pomelloState: pomelloService.getState(),
    serviceId,
  });

  document.body.style.cssText = themeCss;
  window.app.onThemeCssChange(newThemeCss => {
    document.body.style.cssText = newThemeCss;
  });

  createRoot(container).render(
    <StrictMode>
      <Provider store={store}>
        <PomelloProvider service={pomelloService}>
          <QueryClientProvider client={queryClient}>
            <TranslationsProvider commonTranslations={translations}>
              <App hotkeys={hotkeys} services={services} />
            </TranslationsProvider>
          </QueryClientProvider>
        </PomelloProvider>
      </Provider>
    </StrictMode>
  );

  // TODO: Don't show app until here
};

renderApp();
