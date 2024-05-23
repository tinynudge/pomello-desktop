import { AppEvent, SetSelectItemsOptions, Unsubscribe } from '@pomello-desktop/domain';
import { IpcRendererEvent, ipcRenderer } from 'electron';

type SetSelectItemsListener = (options: SetSelectItemsOptions) => void;

export const onSetSelectItems = (callback: SetSelectItemsListener): Unsubscribe => {
  const handler = (_event: IpcRendererEvent, options: SetSelectItemsOptions) => callback(options);

  ipcRenderer.on(AppEvent.SetSelectItems, handler);

  return () => {
    ipcRenderer.off(AppEvent.SetSelectItems, handler);
  };
};
