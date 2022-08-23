import createStore from '@/app/createStore';
import createMockPomelloService from '@/app/__fixtures__/createMockPomelloService';
import { TranslationsProvider } from '@/shared/context/TranslationsContext';
import createMockAppApi from '@/__fixtures__/createMockAppApi';
import createMockSettings from '@/__fixtures__/createMockSettings';
import { Settings } from '@domain';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ReactElement } from 'react';
import { Provider } from 'react-redux';
import translations from '../../../../../translations/en-US.json';

export * from '@testing-library/react';

interface MountComponentOptions {
  appApi?: Partial<AppApi>;
  settings?: Partial<Settings>;
}

const mountComponent = (ui: ReactElement, options: MountComponentOptions = {}) => {
  const settings = createMockSettings(options.settings);

  const [appApi, emitAppApiEvent] = createMockAppApi(options.appApi, settings);
  window.app = appApi;

  // TODO remove dependency on Redux
  const pomelloService = createMockPomelloService(settings);
  const store = createStore({
    pomelloState: pomelloService.getState(),
  });

  const result = render(ui, {
    wrapper: ({ children }) => {
      return (
        <Provider store={store}>
          <TranslationsProvider commonTranslations={translations}>{children}</TranslationsProvider>
        </Provider>
      );
    },
  });

  return {
    appApi,
    emitAppApiEvent,
    result,
    userEvent: userEvent.setup(),
  };
};

export default mountComponent;
