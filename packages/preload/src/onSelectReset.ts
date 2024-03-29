import { AppEvent, type UnsubscribeHandler } from '@domain';
import { ipcRenderer } from 'electron';

type SelectResetListener = () => void;

const onSelectReset = (callback: SelectResetListener): UnsubscribeHandler => {
  const handler = () => callback();

  ipcRenderer.on(AppEvent.ResetSelect, handler);

  return () => {
    ipcRenderer.off(AppEvent.ResetSelect, handler);
  };
};

export default onSelectReset;
