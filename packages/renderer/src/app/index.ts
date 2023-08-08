import services from '@/services';
import createLogger from '@/shared/helpers/createLogger';
import getPomelloServiceConfig from '@/shared/helpers/getPomelloServiceConfig';
import '@/shared/styles/global.scss';
import setTheme from '../setTheme';
import App from './App.svelte';
import createPomelloService from './createPomelloService';

const renderApp = async () => {
  const target = document.getElementById('root');

  if (!target) {
    throw new Error('Unable to find container with id "root"');
  }

  const [pomelloServiceConfig, initialServiceId, hotkeys, settings, themeCss, translations] =
    await Promise.all([
      getPomelloServiceConfig(),
      window.app.getActiveServiceId(),
      window.app.getHotkeys(),
      window.app.getSettings(),
      window.app.getThemeCss(),
      window.app.getTranslations(),
    ]);

  setTheme(themeCss);

  const pomelloService = createPomelloService(settings);

  new App({
    target,
    props: {
      hotkeys,
      initialServiceId,
      logger: createLogger(),
      pomelloService,
      pomelloServiceConfig,
      services,
      settings,
      translations,
    },
  });
};

renderApp();
