import { ActiveService, ServiceConfig } from '@domain';
import { useContext, useSyncExternalStore } from 'react';
import { ServiceContext } from '../context/ServiceContext';
import assertNonNullish from '../helpers/assertNonNullish';

type Selector<TConfig, TValue> = (cache: TConfig) => TValue;

type UseServiceConfigUpdater<TConfig> = [
  ServiceConfigSetter<TConfig>,
  ServiceConfigUnsetter<TConfig>
];

type ServiceConfigSetter<TConfig> = <TKey extends keyof TConfig>(
  key: TKey,
  value: TConfig[TKey]
) => void;

type ServiceConfigUnsetter<TConfig> = (key: keyof TConfig) => void;

const useServiceConfig = <TConfig>(): ServiceConfig<TConfig> => {
  const activeService = useContext(ServiceContext);

  assertNonNullish(activeService, 'useServiceConfig must be used inside a <ServiceProvider>');

  const { config } = activeService as ActiveService<TConfig>;

  assertNonNullish(config, 'The active service does not have a config');

  return config;
};

export const useServiceConfigSelector = <TConfig, TValue = unknown>(
  selector: Selector<TConfig, TValue>
): TValue => {
  const config = useServiceConfig<TConfig>();

  return useSyncExternalStore(config.onChange, () => selector(config.get()));
};

export const useServiceConfigUpdater = <TConfig>(): UseServiceConfigUpdater<TConfig> => {
  const config = useServiceConfig<TConfig>();

  return [config.set, config.unset];
};
