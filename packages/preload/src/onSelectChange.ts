import { AppEvent, Unsubscribe } from '@pomello-desktop/domain';
import { IpcRendererEvent, ipcRenderer } from 'electron';

type SelectOptionListener = (optionId: string) => void;

export const onSelectChange = (callback: SelectOptionListener): Unsubscribe => {
  const handler = (_event: IpcRendererEvent, optionId: string) => callback(optionId);

  ipcRenderer.on(AppEvent.SelectChange, handler);

  return () => {
    ipcRenderer.off(AppEvent.SelectChange, handler);
  };
};
