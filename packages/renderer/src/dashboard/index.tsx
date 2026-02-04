import { createLogger } from '@/__bootstrap__/createLogger';
import { setTheme } from '@/__bootstrap__/setTheme';
import { services } from '@/services';
import { PomelloApiProvider } from '@/shared/context/PomelloApiContext';
import { RuntimeProvider } from '@/shared/context/RuntimeContext';
import { createPomelloApi } from '@/shared/helpers/createPomelloApi';
import { getPomelloServiceConfig } from '@/shared/helpers/getPomelloServiceConfig';
import { HashRouter } from '@solidjs/router';
import { QueryClient, QueryClientProvider } from '@tanstack/solid-query';
import { render } from 'solid-js/web';
import { Layout } from './components/Layout';
import { Routes } from './components/Routes';
import { DashboardProvider } from './context/DashboardContext';

const renderDashboard = async () => {
  const queryClient = new QueryClient();
  const container = document.getElementById('root');

  if (!container) {
    throw new Error('Unable to find container with id "root"');
  }

  const [
    pomelloConfig,
    defaultHotkeys,
    hotkeys,
    settings,
    themeCss,
    sharedTranslations,
    dashboardTranslations,
  ] = await Promise.all([
    getPomelloServiceConfig(),
    window.app.getDefaultHotkeys(),
    window.app.getHotkeys(),
    window.app.getSettings(),
    window.app.getThemeCss(),
    window.app.getTranslations('shared'),
    window.app.getTranslations('dashboard'),
  ]);

  const pomelloApi = createPomelloApi(pomelloConfig);
  const logger = createLogger();

  setTheme(themeCss);

  render(
    () => (
      <QueryClientProvider client={queryClient}>
        <RuntimeProvider
          initialLogger={logger}
          initialPomelloConfig={pomelloConfig}
          initialServices={services}
          initialSettings={settings}
          initialTranslations={{ ...sharedTranslations, ...dashboardTranslations }}
        >
          <PomelloApiProvider initialPomelloApi={pomelloApi}>
            <DashboardProvider initialDefaultHotkeys={defaultHotkeys} initialHotkeys={hotkeys}>
              <HashRouter root={Layout}>
                <Routes />
              </HashRouter>
            </DashboardProvider>
          </PomelloApiProvider>
        </RuntimeProvider>
      </QueryClientProvider>
    ),
    container
  );
};

renderDashboard();
