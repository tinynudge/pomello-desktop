import { AppEvent, Unsubscribe } from '@pomello-desktop/domain';
import { ipcRenderer } from 'electron';

type SelectHideListener = () => void;

export const onSelectHide = (callback: SelectHideListener): Unsubscribe => {
  const handler = () => callback();

  ipcRenderer.on(AppEvent.HideSelect, handler);

  return () => {
    ipcRenderer.off(AppEvent.HideSelect, handler);
  };
};
