import {
  AppEvent,
  ServiceConfigActions,
  ServiceConfigChangeCallback,
  ServiceConfigStore,
  StoreContents,
} from '@domain';
import { ipcRenderer, IpcRendererEvent } from 'electron';

const registerServiceConfig = async <TConfig = StoreContents>(
  serviceId: string,
  configStore: ServiceConfigStore<TConfig>
): Promise<ServiceConfigActions<TConfig>> => {
  const storePath = `services/${serviceId}`;

  const contents = await ipcRenderer.invoke(AppEvent.RegisterServiceConfig, storePath, configStore);

  const onChange = (callback: ServiceConfigChangeCallback<TConfig>) => {
    const handler = (_event: IpcRendererEvent, config: TConfig) => callback(config);

    ipcRenderer.on(`${AppEvent.StoreChange}:${storePath}`, handler);

    return () => {
      ipcRenderer.off(`${AppEvent.StoreChange}:${storePath}`, handler);
    };
  };

  const set = <TKey extends keyof TConfig>(key: TKey, value: TConfig[TKey]) => {
    return ipcRenderer.invoke(AppEvent.SetStoreItem, storePath, key, value);
  };

  const unset = (key: keyof TConfig) => {
    return ipcRenderer.invoke(AppEvent.UnsetStoreItem, storePath, key);
  };

  return {
    contents,
    onChange,
    set,
    unset,
  };
};

export default registerServiceConfig;
