import { AppEvent, type ShowSelectRendererOptions, type UnsubscribeHandler } from '@domain';
import { ipcRenderer, type IpcRendererEvent } from 'electron';

type ShowSelectListener = (options: ShowSelectRendererOptions) => void;

const onSelectShow = (callback: ShowSelectListener): UnsubscribeHandler => {
  const handler = (_event: IpcRendererEvent, options: ShowSelectRendererOptions) =>
    callback(options);

  ipcRenderer.on(AppEvent.ShowSelect, handler);

  return () => {
    ipcRenderer.off(AppEvent.ShowSelect, handler);
  };
};

export default onSelectShow;
