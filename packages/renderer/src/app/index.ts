import setTheme from '../setTheme';
import App from './App.svelte';
import createPomelloService from './createPomelloService';

const renderApp = async () => {
  const target = document.getElementById('root');

  if (!target) {
    throw new Error('Unable to find container with id "root"');
  }

  const [settings, themeCss, translations] = await Promise.all([
    window.app.getSettings(),
    window.app.getThemeCss(),
    window.app.getTranslations(),
  ]);

  setTheme(themeCss);

  const pomelloService = createPomelloService(settings);

  new App({
    target,
    props: {
      pomelloService,
      translations,
    },
  });
};

renderApp();
