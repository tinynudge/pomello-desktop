import {
  AppEvent,
  ServiceConfig,
  ServiceConfigChangeCallback,
  ServiceConfigStore,
  StoreContents,
} from '@domain';
import { ipcRenderer, IpcRendererEvent } from 'electron';

const registerServiceConfig = async <TConfig = StoreContents>(
  serviceId: string,
  configStore: ServiceConfigStore<TConfig>
): Promise<ServiceConfig<TConfig>> => {
  let config = await ipcRenderer.invoke(AppEvent.RegisterServiceConfig, serviceId, configStore);

  const get = () => config;

  const onChange = (callback: ServiceConfigChangeCallback<TConfig>) => {
    const handler = (_event: IpcRendererEvent, config: TConfig) => callback(config);

    ipcRenderer.on(`${AppEvent.StoreChange}:${serviceId}`, handler);

    return () => {
      ipcRenderer.off(`${AppEvent.StoreChange}:${serviceId}`, handler);
    };
  };

  const set = <TKey extends keyof TConfig>(key: TKey, value: TConfig[TKey]) => {
    return ipcRenderer.invoke(AppEvent.SetStoreItem, serviceId, key, value);
  };

  const unregister = () => {
    removeUpdateListener();
  };

  const removeUpdateListener = onChange(updatedConfig => {
    config = updatedConfig;
  });

  return {
    get,
    onChange,
    set,
    unregister,
  };
};

export default registerServiceConfig;
