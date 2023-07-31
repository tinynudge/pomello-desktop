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

  const [themeCss, translations] = await Promise.all([
    window.app.getThemeCss(),
    window.app.getTranslations(),
  ]);

  setTheme(themeCss);

  // TODO: Implement initialServiceId

  new Select({
    target,
    props: {
      initialServiceId: undefined,
      logger: createLogger(),
      services,
      translations,
    },
  });
};

renderSelect();
