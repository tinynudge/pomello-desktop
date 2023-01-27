import { AppEvent, RemoveListenerFunction, Settings } from '@domain';
import { ipcRenderer, IpcRendererEvent } from 'electron';

type SettingsChangeListener = (settings: Settings) => void;

const onSettingsChange = (callback: SettingsChangeListener): RemoveListenerFunction => {
  const handler = (_event: IpcRendererEvent, settings: Settings) => callback(settings);

  ipcRenderer.on(`${AppEvent.StoreChange}:settings`, handler);

  return () => {
    ipcRenderer.off(`${AppEvent.StoreChange}:settings`, handler);
  };
};

export default onSettingsChange;
