import { AppEvent, RemoveListenerFunction } from '@domain';
import { ipcRenderer } from 'electron';

type SelectReadyListener = () => void;

const onSelectReady = (callback: SelectReadyListener): RemoveListenerFunction => {
  const handler = () => callback();

  ipcRenderer.on(AppEvent.SelectReady, handler);

  return () => {
    ipcRenderer.off(AppEvent.SelectReady, handler);
  };
};

export default onSelectReady;
