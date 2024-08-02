import { createLogger } from '@/__bootstrap__/createLogger';
import { setTheme } from '@/__bootstrap__/setTheme';
import { services } from '@/services';
import { RuntimeProvider } from '@/shared/context/RuntimeContext';
import { getPomelloServiceConfig } from '@/shared/helpers/getPomelloServiceConfig';
import { HashRouter } from '@solidjs/router';
import { render } from 'solid-js/web';
import { Layout } from './components/Layout';
import { Routes } from './components/Routes';

const renderDashboard = async () => {
  const container = document.getElementById('root');

  if (!container) {
    throw new Error('Unable to find container with id "root"');
  }

  const [themeCss, translations, pomelloConfig, settings] = await Promise.all([
    window.app.getThemeCss(),
    window.app.getTranslations('dashboard'),
    getPomelloServiceConfig(),
    window.app.getSettings(),
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
        initialTranslations={translations}
      >
        <HashRouter root={Layout}>
          <Routes />
        </HashRouter>
      </RuntimeProvider>
    ),
    container
  );
};

renderDashboard();
