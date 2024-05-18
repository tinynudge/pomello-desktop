import { Settings } from '@pomello-desktop/domain';
import { onCleanup } from 'solid-js';
import { createStore, reconcile } from 'solid-js/store';
import { useRuntime } from './RuntimeContext';

export const useSettings = (): Settings => {
  const runtime = useRuntime();

  return runtime.settings;
};

export const createRuntimeSettings = (initialSettings: Settings): Settings => {
  const [settings, setSettings] = createStore(initialSettings);

  const unsubscribe = window.app.onSettingsChange(settings => setSettings(reconcile(settings)));

  onCleanup(unsubscribe);

  return settings;
};
