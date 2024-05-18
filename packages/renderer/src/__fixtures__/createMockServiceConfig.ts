import { ServiceConfig, ServiceConfigActions, StoreContents } from '@pomello-desktop/domain';
import { vi } from 'vitest';
import { mockRegisterServiceConfig } from './mockRegisterServiceConfig';

export const createMockServiceConfig = <TConfig = StoreContents>(
  serviceId: string,
  initialConfig: TConfig
): [ServiceConfig<TConfig>, ServiceConfigActions<TConfig>] => {
  const configActions = mockRegisterServiceConfig(serviceId, initialConfig);

  const { onChange, set, unset } = configActions;

  let contents = configActions.contents;

  const get = vi.fn(() => contents);

  const removeChangeListener = onChange(updatedContents => {
    contents = updatedContents;
  });

  const unregister = () => {
    removeChangeListener();
  };

  const config = {
    get,
    onChange,
    set,
    unregister,
    unset,
  };

  return [config, configActions];
};
