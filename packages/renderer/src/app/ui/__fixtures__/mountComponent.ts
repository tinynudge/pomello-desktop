import createMockAppApi from '@/__fixtures__/createMockAppApi';
import createMockSettings from '@/__fixtures__/createMockSettings';
import type { Settings } from '@domain';
import { render } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import type { ComponentType } from 'svelte';
import html from 'svelte-htm';
import translations from '../../../../../translations/en-US.json';
import ComponentWrapper from './ComponentWrapper.svelte';

export * from '@testing-library/svelte';

export interface MountComponentOptions {
  appApi?: Partial<AppApi>;
  settings?: Partial<Settings>;
}

const mountComponent = (ui: ComponentType, options: MountComponentOptions = {}) => {
  const settings = createMockSettings(options.settings);

  const [appApi, emitAppApiEvent] = createMockAppApi({
    appApi: options.appApi,
    settings,
  });
  window.app = appApi;

  const result = render(html`
    <${ComponentWrapper} translations=${translations}>
      <${ui} />
    </$>
  `);

  return {
    appApi,
    emitAppApiEvent,
    result,
    userEvent: userEvent.setup(),
  };
};

export default mountComponent;
