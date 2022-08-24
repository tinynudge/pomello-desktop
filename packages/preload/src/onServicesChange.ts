import { AppEvent, RemoveListenerFunction, Services } from '@domain';
import { ipcRenderer, IpcRendererEvent } from 'electron';

type ServicesChangeListener = (services: Services) => void;

const onServicesChange = (callback: ServicesChangeListener): RemoveListenerFunction => {
  const handler = (_event: IpcRendererEvent, services: Services) => callback(services);

  ipcRenderer.on(`${AppEvent.StoreChange}:services`, handler);

  return () => {
    ipcRenderer.off(`${AppEvent.StoreChange}:services`, handler);
  };
};

export default onServicesChange;
