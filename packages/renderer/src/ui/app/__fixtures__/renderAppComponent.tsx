import { createMockAppApi } from '@/__fixtures__/createMockAppApi';
import { createMockLogger } from '@/__fixtures__/createMockLogger';
import { createMockServiceConfig } from '@/__fixtures__/createMockServiceConfig';
import { createMockSettings } from '@/__fixtures__/createMockSettings';
import { RuntimeProvider } from '@/shared/context/RuntimeContext';
import { PomelloServiceConfig, Settings } from '@pomello-desktop/domain';
import { render } from '@solidjs/testing-library';
import userEvent from '@testing-library/user-event';
import { JSX } from 'solid-js';
import translations from '../../../../../../translations/main/en-US.json';

export * from '@solidjs/testing-library';

type RenderAppComponentOptions = {
  appApi?: Partial<AppApi>;
  settings?: Partial<Settings>;
};

export const renderAppComponent = (
  ui: () => JSX.Element,
  options: RenderAppComponentOptions = {}
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
          initialTranslations={translations}
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
