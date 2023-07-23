import type { Settings } from '@domain';
import { getContext, setContext } from 'svelte';
import { readable, type Readable } from 'svelte/store';

const settingsContext = 'settings';

const setSettingsContext = (settings: Settings) => {
  const settingsStore = readable<Settings>(settings, set => window.app.onSettingsChange(set));

  setContext(settingsContext, settingsStore);
};

const getSettingsContext = (): Readable<Settings> => {
  return getContext(settingsContext);
};

export { getSettingsContext, setSettingsContext };
