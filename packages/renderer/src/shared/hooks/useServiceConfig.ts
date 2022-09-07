import { ActiveService } from '@domain';
import { useContext, useEffect, useState } from 'react';
import { ServiceContext } from '../context/ServiceContext';

type UseServiceConfig<TConfig> = [
  TConfig,
  ServiceConfigSetter<TConfig>,
  ServiceConfigUnsetter<TConfig>
];

type ServiceConfigSetter<TConfig> = <TKey extends keyof TConfig>(
  key: TKey,
  value: TConfig[TKey]
) => void;

type ServiceConfigUnsetter<TConfig> = (key: keyof TConfig) => void;

const useServiceConfig = <TConfig>(): UseServiceConfig<TConfig> => {
  const activeService = useContext(ServiceContext);

  if (!activeService) {
    throw new Error('useServiceConfig must be used inside a <ServiceProvider>');
  }

  const { config } = activeService as ActiveService<TConfig>;

  if (!config) {
    throw new Error('The active service does not have a config');
  }

  const [contents, setContents] = useState(config.get());

  useEffect(() => {
    return config.onChange(setContents);
  }, [config]);

  return [contents, config.set, config.unset];
};

export default useServiceConfig;
