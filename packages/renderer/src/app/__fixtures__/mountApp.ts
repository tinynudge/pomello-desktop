import type { Settings } from '@domain';
import { render } from '@testing-library/svelte';
import translations from '../../../../translations/en-US.json';
import App from '../App.svelte';
import createMockPomelloService from './createMockPomelloService';
import createMockSettings from './createMockSettings';

export * from '@testing-library/svelte';

export type MountAppResults = ReturnType<typeof mountApp>;

export interface MountAppOptions {
  settings?: Partial<Settings>;
}

const mountApp = (options: MountAppOptions = {}) => {
  const settings = createMockSettings(options.settings);
  const pomelloService = createMockPomelloService(settings);

  render(App, {
    pomelloService,
    translations,
  });

  return {};
};

export default mountApp;
