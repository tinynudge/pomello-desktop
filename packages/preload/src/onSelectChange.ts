import { AppEvent, type UnsubscribeHandler } from '@domain';
import { ipcRenderer, type IpcRendererEvent } from 'electron';

type SelectOptionListener = (optionId: string) => void;

const onSelectChange = (callback: SelectOptionListener): UnsubscribeHandler => {
  const handler = (_event: IpcRendererEvent, optionId: string) => callback(optionId);

  ipcRenderer.on(AppEvent.SelectChange, handler);

  return () => {
    ipcRenderer.off(AppEvent.SelectChange, handler);
  };
};

export default onSelectChange;
