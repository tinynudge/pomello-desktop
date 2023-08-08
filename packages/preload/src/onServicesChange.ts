import { AppEvent, type Services, type UnsubscribeHandler } from '@domain';
import { ipcRenderer, type IpcRendererEvent } from 'electron';

type ServicesChangeListener = (services: Services) => void;

const onServicesChange = (callback: ServicesChangeListener): UnsubscribeHandler => {
  const handler = (_event: IpcRendererEvent, services: Services) => callback(services);

  ipcRenderer.on(`${AppEvent.StoreChange}:services`, handler);

  return () => {
    ipcRenderer.off(`${AppEvent.StoreChange}:services`, handler);
  };
};

export default onServicesChange;
