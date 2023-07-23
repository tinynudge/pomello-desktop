import type { ServiceConfig, ServiceConfigChangeCallback, StoreContents } from '@domain';
import { vi } from 'vitest';

const mockRegisterServiceConfig = <TConfig = StoreContents>(
  _serviceId: string,
  initialConfig: TConfig
): ServiceConfig<TConfig> => {
  let contents = JSON.parse(JSON.stringify(initialConfig));

  const listeners = new Set<ServiceConfigChangeCallback<TConfig>>();

  const emitChangeEvent = () => {
    listeners.forEach(callback => callback(contents));
  };

  const get = () => contents;

  const onChange = vi.fn((callback: ServiceConfigChangeCallback<TConfig>) => {
    listeners.add(callback);

    return () => {
      listeners.delete(callback);
    };
  });

  const set = vi.fn(<TKey extends keyof TConfig>(key: TKey, value: TConfig[TKey]) => {
    contents = { ...contents, [key]: value };

    emitChangeEvent();
  });

  const unregister = onChange(updatedContents => {
    contents = updatedContents;
  });

  const unset = vi.fn((key: keyof TConfig) => {
    contents = { ...contents };
    delete contents[key];

    emitChangeEvent();
  });

  return {
    get,
    onChange,
    set,
    unregister,
    unset,
  };
};

export default mockRegisterServiceConfig;
