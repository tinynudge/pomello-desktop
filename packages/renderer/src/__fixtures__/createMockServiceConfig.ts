import {
  ServiceConfig,
  ServiceConfigChangeCallback,
  ServiceConfigStore,
  StoreContents,
} from '@domain';

const createMockServiceConfig = <TConfig = StoreContents>(
  _serviceId: string,
  configStore: ServiceConfigStore<TConfig>,
  initialConfig?: TConfig
): Promise<ServiceConfig<TConfig>> => {
  const config = JSON.parse(JSON.stringify(initialConfig ?? configStore.defaults));

  const listeners = new Set<ServiceConfigChangeCallback<TConfig>>();

  const get = () => config;

  const onChange = (callback: ServiceConfigChangeCallback<TConfig>) => {
    listeners.add(callback);

    return () => {
      listeners.delete(callback);
    };
  };

  const set = <TKey extends keyof TConfig>(key: TKey, value: TConfig[TKey]) => {
    config[key] = value;

    listeners.forEach(callback => callback(config));
  };

  const unregister = () => {
    listeners.clear();
  };

  return Promise.resolve({
    get,
    onChange,
    set,
    unregister,
  });
};

export default createMockServiceConfig;
