import { AppEvent, ShowSelectRendererOptions, UnsubscribeHandler } from '@domain';
import { ipcRenderer, IpcRendererEvent } from 'electron';

type ShowSelectListener = (options: ShowSelectRendererOptions) => void;

const onShowSelect = (callback: ShowSelectListener): UnsubscribeHandler => {
  const handler = (_event: IpcRendererEvent, options: ShowSelectRendererOptions) =>
    callback(options);

  ipcRenderer.on(AppEvent.ShowSelect, handler);

  return () => {
    ipcRenderer.off(AppEvent.ShowSelect, handler);
  };
};

export default onShowSelect;
