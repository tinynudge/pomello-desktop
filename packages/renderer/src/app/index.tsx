import App from '@/app/App';
import { PomelloContextProvider } from '@/app/context/PomelloContext';
import createStore from '@/app/createStore';
import services from '@/services';
import createPomelloService from '@/__bootstrap__/createPomelloService';
import getThemeCss from '@/__bootstrap__/getThemeCss';
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

  const [pomelloService, themeCss] = await Promise.all([createPomelloService(), getThemeCss()]);

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
        <PomelloContextProvider service={pomelloService}>
          <QueryClientProvider client={queryClient}>
            <App services={services} />
          </QueryClientProvider>
        </PomelloContextProvider>
      </Provider>
    </StrictMode>
  );

  // TODO: Don't show app until here
};

renderApp();
