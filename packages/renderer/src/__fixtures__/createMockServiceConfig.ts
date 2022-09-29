import { ServiceConfig, ServiceConfigActions, StoreContents } from '@domain';
import { vi } from 'vitest';

const createMockServiceConfig = <TConfig = StoreContents>(
  configActions: ServiceConfigActions<TConfig>
): ServiceConfig<TConfig> => {
  const { onChange, set, unset } = configActions;

  let contents = configActions.contents;

  const get = vi.fn(() => contents);

  const removeChangeListener = onChange(updatedContents => {
    contents = updatedContents;
  });

  const unregister = () => {
    removeChangeListener();
  };

  return {
    get,
    onChange,
    set,
    unregister,
    unset,
  };
};

export default createMockServiceConfig;
