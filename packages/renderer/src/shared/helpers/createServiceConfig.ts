import { ServiceConfig, ServiceConfigStore, StoreContents } from '@domain';

const createServiceConfig = async <TContents = StoreContents>(
  serviceId: string,
  config: ServiceConfigStore<TContents>
): Promise<ServiceConfig<TContents>> => {
  const serviceConfig = await window.app.registerServiceConfig(serviceId, config);

  let contents = serviceConfig.contents;

  const get = () => contents;

  const removeChangeListener = serviceConfig.onChange(updatedContents => {
    contents = updatedContents;
  });

  const unregister = () => {
    removeChangeListener();
  };

  return {
    get,
    onChange: serviceConfig.onChange,
    set: serviceConfig.set,
    unregister,
    unset: serviceConfig.unset,
  };
};

export default createServiceConfig;
