import { AppEvent, ShowSelectRendererOptions, Unsubscribe } from '@pomello-desktop/domain';
import { IpcRendererEvent, ipcRenderer } from 'electron';

type ShowSelectListener = (options: ShowSelectRendererOptions) => void;

const onShowSelect = (callback: ShowSelectListener): Unsubscribe => {
  const handler = (_event: IpcRendererEvent, options: ShowSelectRendererOptions) =>
    callback(options);

  ipcRenderer.on(AppEvent.ShowSelect, handler);

  return () => {
    ipcRenderer.off(AppEvent.ShowSelect, handler);
  };
};

export default onShowSelect;
