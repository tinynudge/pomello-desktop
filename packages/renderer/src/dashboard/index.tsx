import { createLogger } from '@/__bootstrap__/createLogger';
import { setTheme } from '@/__bootstrap__/setTheme';
import { services } from '@/services';
import { RuntimeProvider } from '@/shared/context/RuntimeContext';
import { getPomelloServiceConfig } from '@/shared/helpers/getPomelloServiceConfig';
import { HashRouter } from '@solidjs/router';
import { render } from 'solid-js/web';
import { Layout } from './components/Layout';
import { Routes } from './components/Routes';
import { DashboardProvider } from './context/DashboardContext';

const renderDashboard = async () => {
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

  const logger = createLogger();

  setTheme(themeCss);

  render(
    () => (
      <RuntimeProvider
        initialLogger={logger}
        initialPomelloConfig={pomelloConfig}
        initialServices={services}
        initialSettings={settings}
        initialTranslations={{ ...sharedTranslations, ...dashboardTranslations }}
      >
        <DashboardProvider initialDefaultHotkeys={defaultHotkeys} initialHotkeys={hotkeys}>
          <HashRouter root={Layout}>
            <Routes />
          </HashRouter>
        </DashboardProvider>
      </RuntimeProvider>
    ),
    container
  );
};

renderDashboard();
