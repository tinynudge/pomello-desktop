import { AppEvent, Unsubscribe } from '@pomello-desktop/domain';
import { ipcRenderer } from 'electron';

type SelectResetListener = () => void;

export const onSelectReset = (callback: SelectResetListener): Unsubscribe => {
  const handler = () => callback();

  ipcRenderer.on(AppEvent.ResetSelect, handler);

  return () => {
    ipcRenderer.off(AppEvent.ResetSelect, handler);
  };
};
