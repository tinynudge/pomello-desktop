import { createMockAppApi } from '@/__fixtures__/createMockAppApi';
import { createMockLogger } from '@/__fixtures__/createMockLogger';
import { createMockServiceConfig } from '@/__fixtures__/createMockServiceConfig';
import { createMockSettings } from '@/__fixtures__/createMockSettings';
import { RuntimeProvider } from '@/shared/context/RuntimeContext';
import { PomelloServiceConfig, Settings, TranslationsDictionary } from '@pomello-desktop/domain';
import { render } from '@solidjs/testing-library';
import userEvent from '@testing-library/user-event';
import { JSX } from 'solid-js';

export * from '@solidjs/testing-library';

type RenderSharedComponentOptions = {
  appApi?: Partial<AppApi>;
  settings?: Partial<Settings>;
  translations?: TranslationsDictionary;
};

export const renderSharedComponent = (
  ui: () => JSX.Element,
  options: RenderSharedComponentOptions = {}
) => {
  const logger = createMockLogger();
  const settings = createMockSettings(options.settings);
  const [pomelloConfig] = createMockServiceConfig<PomelloServiceConfig>('pomello', {});
  const [appApi, emitAppApiEvent] = createMockAppApi({
    appApi: options.appApi,
    settings,
  });

  const result = render(ui, {
    wrapper: props => {
      return (
        <RuntimeProvider
          initialLogger={logger}
          initialPomelloConfig={pomelloConfig}
          initialServices={{}}
          initialSettings={settings}
          initialTranslations={{ ...options.translations }}
        >
          {props.children}
        </RuntimeProvider>
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
