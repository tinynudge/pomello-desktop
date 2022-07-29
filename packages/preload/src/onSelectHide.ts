import { AppEvent, RemoveListenerFunction } from '@domain';
import { ipcRenderer } from 'electron';

type SelectHideListener = () => void;

const onSelectHide = (callback: SelectHideListener): RemoveListenerFunction => {
  const handler = () => callback();

  ipcRenderer.on(AppEvent.HideSelect, handler);

  return () => {
    ipcRenderer.off(AppEvent.HideSelect, handler);
  };
};

export default onSelectHide;
