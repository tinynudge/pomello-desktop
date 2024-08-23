import { AppEvent, FormattedHotkeys, Unsubscribe } from '@pomello-desktop/domain';
import { IpcRendererEvent, ipcRenderer } from 'electron';

type HotkeysChangeListener = (hotkeys: FormattedHotkeys) => void;

export const onHotkeysChange = (callback: HotkeysChangeListener): Unsubscribe => {
  const handler = (_event: IpcRendererEvent, hotkeys: FormattedHotkeys) => callback(hotkeys);

  ipcRenderer.on(AppEvent.HotkeysChange, handler);

  return () => {
    ipcRenderer.off(AppEvent.HotkeysChange, handler);
  };
};
