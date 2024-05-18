import {
  ServiceConfigActions,
  ServiceConfigChangeCallback,
  StoreContents,
} from '@pomello-desktop/domain';
import { vi } from 'vitest';

export const mockRegisterServiceConfig = <TConfig = StoreContents>(
  _serviceId: string,
  initialConfig: TConfig
): ServiceConfigActions<TConfig> => {
  let contents = JSON.parse(JSON.stringify(initialConfig));

  const listeners = new Set<ServiceConfigChangeCallback<TConfig>>();

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

  const unset = vi.fn((key: keyof TConfig) => {
    contents = { ...contents };
    delete contents[key];

    emitChangeEvent();
  });

  const emitChangeEvent = () => {
    listeners.forEach(callback => callback(contents));
  };

  return {
    contents,
    onChange,
    set,
    unset,
  };
};
