import { AppEvent, type UnsubscribeHandler } from '@domain';
import { ipcRenderer } from 'electron';

type SelectHideListener = () => void;

const onSelectHide = (callback: SelectHideListener): UnsubscribeHandler => {
  const handler = () => callback();

  ipcRenderer.on(AppEvent.HideSelect, handler);

  return () => {
    ipcRenderer.off(AppEvent.HideSelect, handler);
  };
};

export default onSelectHide;
