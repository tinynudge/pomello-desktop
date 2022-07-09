import { AppEvent, RemoveListenerFunction, ShowSelectOptions } from '@domain';
import { ipcRenderer, IpcRendererEvent } from 'electron';

type ShowSelectListener = (options: ShowSelectOptions) => void;

const onSelectShow = (callback: ShowSelectListener): RemoveListenerFunction => {
  const handler = (_event: IpcRendererEvent, options: ShowSelectOptions) => callback(options);

  ipcRenderer.on(AppEvent.ShowSelect, handler);

  return () => {
    ipcRenderer.off(AppEvent.ShowSelect, handler);
  };
};

export default onSelectShow;
