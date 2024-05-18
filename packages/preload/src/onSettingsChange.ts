import { AppEvent, Settings, Unsubscribe } from '@pomello-desktop/domain';
import { IpcRendererEvent, ipcRenderer } from 'electron';

type SettingsChangeListener = (settings: Settings) => void;

const onSettingsChange = (callback: SettingsChangeListener): Unsubscribe => {
  const handler = (_event: IpcRendererEvent, settings: Settings) => callback(settings);

  ipcRenderer.on(`${AppEvent.StoreChange}:settings`, handler);

  return () => {
    ipcRenderer.off(`${AppEvent.StoreChange}:settings`, handler);
  };
};

export default onSettingsChange;
