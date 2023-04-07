import { AppEvent, RemoveListenerFunction } from '@domain';
import { IpcRendererEvent, ipcRenderer } from 'electron';

type PowerMonitorChangeListener = (status: 'suspend' | 'resume') => void;

const onPowerMonitorChange = (callback: PowerMonitorChangeListener): RemoveListenerFunction => {
  const handler = (_event: IpcRendererEvent, status: 'resume' | 'suspend') => callback(status);

  ipcRenderer.on(AppEvent.PowerMonitorChange, handler);

  return () => {
    ipcRenderer.off(AppEvent.PowerMonitorChange, handler);
  };
};

export default onPowerMonitorChange;
