import createMockAppApi from '@/__fixtures__/createMockAppApi';
import createMockSettings from '@/__fixtures__/createMockSettings';
import type { Settings } from '@domain';
import { render } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import type { ComponentType } from 'svelte';
import html from 'svelte-htm';
import { vi } from 'vitest';
import translations from '../../../../../translations/en-US.json';
import ComponentWrapper from './ComponentWrapper.svelte';

export * from '@testing-library/svelte';

export interface MountComponentOptions {
  appApi?: Partial<AppApi>;
  settings?: Partial<Settings>;
}

const mountComponent = (ui: ComponentType, options: MountComponentOptions = {}) => {
  // Since tests are running in a Node environment, it uses the "node" exports
  // from Svelte which point to the SSR import path. For SSR, life cycle methods
  // do not run and are exported as a noop.
  // https://github.com/testing-library/svelte-testing-library/issues/222#issuecomment-1588987135
  vi.mock('svelte', async () => {
    const actual = (await vi.importActual('svelte')) as object;
    return {
      ...actual,
      onMount: (await import('svelte/internal')).onMount,
    };
  });

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
