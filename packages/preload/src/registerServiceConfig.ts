import {
  AppEvent,
  type ServiceConfig,
  type ServiceConfigStore,
  type StoreContents,
  type StoreSubscription,
} from '@domain';
import { ipcRenderer, type IpcRendererEvent } from 'electron';

const registerServiceConfig = async <TConfig = StoreContents>(
  serviceId: string,
  configStore: ServiceConfigStore<TConfig>
): Promise<ServiceConfig<TConfig>> => {
  const storePath = `services/${serviceId}`;
  const subscriptions = new Set<StoreSubscription<TConfig>>();

  let contents = await ipcRenderer.invoke(AppEvent.RegisterServiceConfig, storePath, configStore);

  const handleStoreChange = (_event: IpcRendererEvent, updatedContents: TConfig) => {
    contents = updatedContents;

    subscriptions.forEach(subscription => subscription(updatedContents));
  };

  const get = () => contents;

  const set = <TKey extends keyof TConfig>(key: TKey, value: TConfig[TKey]) => {
    return ipcRenderer.invoke(AppEvent.SetStoreItem, storePath, key, value);
  };

  const subscribe = (subscription: StoreSubscription<TConfig>) => {
    subscription(contents);

    subscriptions.add(subscription);

    return () => {
      subscriptions.delete(subscription);
    };
  };

  const unregister = () => {
    ipcRenderer.off(`${AppEvent.StoreChange}:${storePath}`, handleStoreChange);
  };

  const unset = (key: keyof TConfig) => {
    return ipcRenderer.invoke(AppEvent.UnsetStoreItem, storePath, key);
  };

  ipcRenderer.on(`${AppEvent.StoreChange}:${storePath}`, handleStoreChange);

  return {
    get,
    set,
    subscribe,
    unregister,
    unset,
  };
};

export default registerServiceConfig;
