import type { ServiceConfig, StoreContents, StoreSubscription } from '@domain';
import { vi } from 'vitest';

const mockRegisterServiceConfig = <TConfig = StoreContents>(
  _serviceId: string,
  initialConfig: TConfig
): ServiceConfig<TConfig> => {
  let contents = JSON.parse(JSON.stringify(initialConfig));

  const subscriptions = new Set<StoreSubscription<TConfig>>();

  const emitChangeEvent = () => {
    subscriptions.forEach(callback => callback(contents));
  };

  const get = () => contents;

  const set = vi.fn(<TKey extends keyof TConfig>(key: TKey, value: TConfig[TKey]) => {
    contents = { ...contents, [key]: value };

    emitChangeEvent();
  });

  const subscribe = vi.fn((subscription: StoreSubscription<TConfig>) => {
    subscription(contents);

    subscriptions.add(subscription);

    return () => {
      subscriptions.delete(subscription);
    };
  });

  const unregister = vi.fn();

  const unset = vi.fn((key: keyof TConfig) => {
    contents = { ...contents };
    delete contents[key];

    emitChangeEvent();
  });

  return {
    get,
    subscribe,
    set,
    unregister,
    unset,
  };
};

export default mockRegisterServiceConfig;
