import { AppEvent, RemoveListenerFunction, SetSelectItemsOptions } from '@domain';
import { ipcRenderer, IpcRendererEvent } from 'electron';

type SetSelectItemsListener = (options: SetSelectItemsOptions) => void;

const onSetSelectItems = (callback: SetSelectItemsListener): RemoveListenerFunction => {
  const handler = (_event: IpcRendererEvent, options: SetSelectItemsOptions) => callback(options);

  ipcRenderer.on(AppEvent.SetSelectItems, handler);

  return () => {
    ipcRenderer.off(AppEvent.SetSelectItems, handler);
  };
};

export default onSetSelectItems;
