import { ActiveService } from '@domain';
import { useContext, useEffect, useState } from 'react';
import { ServiceContext } from '../context/ServiceContext';
import assertNonNullish from '../helpers/assertNonNullish';

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

  assertNonNullish(activeService, 'useServiceConfig must be used inside a <ServiceProvider>');

  const { config } = activeService as ActiveService<TConfig>;

  assertNonNullish(config, 'The active service does not have a config');

  const [contents, setContents] = useState(config.get());

  useEffect(() => {
    return config.onChange(setContents);
  }, [config]);

  return [contents, config.set, config.unset];
};

export default useServiceConfig;
