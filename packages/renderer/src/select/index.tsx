import { createLogger } from '@/__bootstrap__/createLogger';
import { setTheme } from '@/__bootstrap__/setTheme';
import { Select } from '@/select/Select';
import { services } from '@/services';
import { RuntimeProvider } from '@/shared/context/RuntimeContext';
import { ServiceProvider } from '@/shared/context/ServiceContext';
import { getPomelloServiceConfig } from '@/shared/helpers/getPomelloServiceConfig';
import { render } from 'solid-js/web';

const renderSelect = async () => {
  const container = document.getElementById('root');

  if (!container) {
    throw new Error('Unable to find container with id "root"');
  }

  const [pomelloConfig, serviceId, settings, themeCss, translations] = await Promise.all([
    getPomelloServiceConfig(),
    window.app.getActiveServiceId(),
    window.app.getSettings(),
    window.app.getThemeCss(),
    window.app.getTranslations(),
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
        <ServiceProvider initialServiceId={serviceId}>
          <Select />
        </ServiceProvider>
      </RuntimeProvider>
    ),
    container
  );
};

renderSelect();
