import { createLogger } from '@/__bootstrap__/createLogger';
import { setTheme } from '@/__bootstrap__/setTheme';
import { services } from '@/services';
import { RuntimeProvider } from '@/shared/context/RuntimeContext';
import { ServiceProvider } from '@/shared/context/ServiceContext';
import { getPomelloServiceConfig } from '@/shared/helpers/getPomelloServiceConfig';
import { AuthWindowType } from '@pomello-desktop/domain';
import { render } from 'solid-js/web';
import { Auth } from './Auth';

const renderAuth = async () => {
  const container = document.getElementById('root');

  if (!container) {
    throw new Error('Unable to find container with id "root"');
  }

  const [pomelloConfig, settings, themeCss, translations] = await Promise.all([
    getPomelloServiceConfig(),
    window.app.getSettings(),
    window.app.getThemeCss(),
    window.app.getTranslations(),
  ]);

  const logger = createLogger();

  setTheme(themeCss);

  let authWindow: AuthWindowType;

  try {
    const queryParams = new URLSearchParams(window.location.search);
    const authParm = queryParams.get('auth');

    authWindow = JSON.parse(authParm ?? '');
  } catch (error) {
    throw new Error('Unable to parse "auth" param from URL');
  }

  const serviceId = authWindow.type === 'service' ? authWindow.serviceId : undefined;

  render(
    () => (
      <RuntimeProvider
        initialLogger={logger}
        initialPomelloConfig={pomelloConfig}
        initialServices={services}
        initialSettings={settings}
        initialTranslations={translations}
      >
        <ServiceProvider freezeServiceId initialServiceId={serviceId}>
          <Auth authWindow={authWindow} />
        </ServiceProvider>
      </RuntimeProvider>
    ),
    container
  );
};

renderAuth();
