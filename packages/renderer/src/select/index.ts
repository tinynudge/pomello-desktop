import services from '@/services';
import setTheme from '@/setTheme';
import createLogger from '@/shared/helpers/createLogger';
import '@/shared/styles/global.scss';
import Select from './Select.svelte';

const renderSelect = async () => {
  const target = document.getElementById('root');

  if (!target) {
    throw new Error('Unable to find target with id "root"');
  }

  const [initialServiceId, settings, themeCss, translations] = await Promise.all([
    window.app.getActiveServiceId(),
    window.app.getSettings(),
    window.app.getThemeCss(),
    window.app.getTranslations(),
  ]);

  setTheme(themeCss);

  new Select({
    target,
    props: {
      initialServiceId,
      logger: createLogger(),
      services,
      settings,
      translations,
    },
  });
};

renderSelect();
