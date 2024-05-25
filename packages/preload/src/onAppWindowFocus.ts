import { AppEvent, Unsubscribe } from '@pomello-desktop/domain';
import { ipcRenderer } from 'electron';

type AppWindowFocusListener = () => void;

export const onAppWindowFocus = (callback: AppWindowFocusListener): Unsubscribe => {
  const handler = () => callback();

  ipcRenderer.on(AppEvent.AppWindowFocus, handler);

  return () => {
    ipcRenderer.off(AppEvent.AppWindowFocus, handler);
  };
};
