import { AppEvent, RemoveListenerFunction } from '@domain';
import { ipcRenderer, IpcRendererEvent } from 'electron';

type SelectOptionListener = (optionId: string) => void;

const onSelectChange = (callback: SelectOptionListener): RemoveListenerFunction => {
  const handler = (_event: IpcRendererEvent, optionId: string) => callback(optionId);

  ipcRenderer.on(AppEvent.SelectChange, handler);

  return () => {
    ipcRenderer.off(AppEvent.SelectChange, handler);
  };
};

export default onSelectChange;
