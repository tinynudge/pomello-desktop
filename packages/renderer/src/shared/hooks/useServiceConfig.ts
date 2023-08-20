import { ActiveService, ServiceConfig } from '@domain';
import { useContext } from 'react';
import { ServiceContext } from '../context/ServiceContext';
import assertNonNullish from '../helpers/assertNonNullish';

const useServiceConfig = <TConfig>(): ServiceConfig<TConfig> => {
  const activeService = useContext(ServiceContext);

  assertNonNullish(activeService, 'useServiceConfig must be used inside a <ServiceProvider>');

  const { config } = activeService as ActiveService<TConfig>;

  assertNonNullish(config, 'The active service does not have a config');

  return config;
};

export default useServiceConfig;
