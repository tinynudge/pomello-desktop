import { AppEvent, LabeledHotkeys, Unsubscribe } from '@pomello-desktop/domain';
import { IpcRendererEvent, ipcRenderer } from 'electron';

type HotkeysChangeListener = (hotkeys: LabeledHotkeys) => void;

export const onHotkeysChange = (callback: HotkeysChangeListener): Unsubscribe => {
  const handler = (_event: IpcRendererEvent, hotkeys: LabeledHotkeys) => callback(hotkeys);

  ipcRenderer.on(AppEvent.HotkeysChange, handler);

  return () => {
    ipcRenderer.off(AppEvent.HotkeysChange, handler);
  };
};
