import {
  AppEvent,
  type ServiceConfig,
  type ServiceConfigChangeCallback,
  type ServiceConfigStore,
  type StoreContents,
} from '@domain';
import { ipcRenderer, type IpcRendererEvent } from 'electron';

const registerServiceConfig = async <TConfig = StoreContents>(
  serviceId: string,
  configStore: ServiceConfigStore<TConfig>
): Promise<ServiceConfig<TConfig>> => {
  const storePath = `services/${serviceId}`;

  let contents = await ipcRenderer.invoke(AppEvent.RegisterServiceConfig, storePath, configStore);

  const onChange = (callback: ServiceConfigChangeCallback<TConfig>) => {
    const handler = (_event: IpcRendererEvent, config: TConfig) => callback(config);

    ipcRenderer.on(`${AppEvent.StoreChange}:${storePath}`, handler);

    return () => {
      ipcRenderer.off(`${AppEvent.StoreChange}:${storePath}`, handler);
    };
  };

  const get = () => contents;

  const set = <TKey extends keyof TConfig>(key: TKey, value: TConfig[TKey]) => {
    return ipcRenderer.invoke(AppEvent.SetStoreItem, storePath, key, value);
  };

  const unset = (key: keyof TConfig) => {
    return ipcRenderer.invoke(AppEvent.UnsetStoreItem, storePath, key);
  };

  const unregister = onChange(updatedContents => {
    contents = updatedContents;
  });

  return {
    get,
    onChange,
    set,
    unregister,
    unset,
  };
};

export default registerServiceConfig;
