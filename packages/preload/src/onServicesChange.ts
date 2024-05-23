import { AppEvent, Services, Unsubscribe } from '@pomello-desktop/domain';
import { IpcRendererEvent, ipcRenderer } from 'electron';

type ServicesChangeListener = (services: Services) => void;

export const onServicesChange = (callback: ServicesChangeListener): Unsubscribe => {
  const handler = (_event: IpcRendererEvent, services: Services) => callback(services);

  ipcRenderer.on(`${AppEvent.StoreChange}:services`, handler);

  return () => {
    ipcRenderer.off(`${AppEvent.StoreChange}:services`, handler);
  };
};
