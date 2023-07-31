import { AppEvent, SetSelectItemsOptions, UnsubscribeHandler } from '@domain';
import { IpcRendererEvent, ipcRenderer } from 'electron';

type SetSelectItemsListener = (options: SetSelectItemsOptions) => void;

const onSetSelectItems = (callback: SetSelectItemsListener): UnsubscribeHandler => {
  const handler = (_event: IpcRendererEvent, options: SetSelectItemsOptions) => callback(options);

  ipcRenderer.on(AppEvent.SetSelectItems, handler);

  return () => {
    ipcRenderer.off(AppEvent.SetSelectItems, handler);
  };
};

export default onSetSelectItems;
