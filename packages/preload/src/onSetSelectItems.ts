import { AppEvent, type SetSelectItemsOptions, type UnsubscribeHandler } from '@domain';
import { ipcRenderer, type IpcRendererEvent } from 'electron';

type SetSelectItemsListener = (options: SetSelectItemsOptions) => void;

const onSetSelectItems = (callback: SetSelectItemsListener): UnsubscribeHandler => {
  const handler = (_event: IpcRendererEvent, options: SetSelectItemsOptions) => callback(options);

  ipcRenderer.on(AppEvent.SetSelectItems, handler);

  return () => {
    ipcRenderer.off(AppEvent.SetSelectItems, handler);
  };
};

export default onSetSelectItems;
