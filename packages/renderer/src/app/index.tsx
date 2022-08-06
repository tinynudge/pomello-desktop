import App from '@/app/App';
import { PomelloProvider } from '@/app/context/PomelloContext';
import createStore from '@/app/createStore';
import services from '@/services';
import { TranslationsProvider } from '@/shared/context/TranslationsContext';
import createPomelloService from '@/__bootstrap__/createPomelloService';
import getHotkeys from '@/__bootstrap__/getHotkeys';
import getThemeCss from '@/__bootstrap__/getThemeCss';
import getTranslations from '@/__bootstrap__/getTranslations';
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

  const [pomelloService, hotkeys, themeCss, translations] = await Promise.all([
    createPomelloService(),
    getHotkeys(),
    getThemeCss(),
    getTranslations(),
  ]);

  const store = createStore({
    pomelloState: pomelloService.getState(),
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
            <TranslationsProvider translations={translations}>
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
