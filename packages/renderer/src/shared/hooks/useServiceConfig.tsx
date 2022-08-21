import { ServiceConfig, StoreContents } from '@domain';
import { useEffect, useState } from 'react';

type UseServiceConfig<TContents> = [TContents, ServiceConfigSetter<TContents>];

type ServiceConfigSetter<TContents> = <TKey extends keyof TContents>(
  key: TKey,
  value: TContents[TKey]
) => void;

const useServiceConfig = <TContents extends StoreContents>(
  config: ServiceConfig<TContents>
): UseServiceConfig<TContents> => {
  const [contents, setContents] = useState(config.get());

  useEffect(() => {
    return config.onChange(setContents);
  }, [config]);

  return [contents, config.set];
};

export default useServiceConfig;
