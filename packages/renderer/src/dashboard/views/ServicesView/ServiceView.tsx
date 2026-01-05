import { MainHeader } from '@/dashboard/components/MainHeader';
import { ConfigureServiceConfigProvider } from '@/shared/context/ConfigureServiceConfigContext';
import { useServiceResource } from '@/shared/context/ServiceContext';
import { ServiceConfig, StoreContents } from '@pomello-desktop/domain';
import { Component, Show } from 'solid-js';
import { Dynamic } from 'solid-js/web';

export const ServiceView: Component = () => {
  const getServiceResource = useServiceResource();

  return (
    <Show when={getServiceResource()}>
      {getServiceResource => (
        <ConfigureServiceConfigProvider
          initialServiceConfig={getServiceResource().config as ServiceConfig<StoreContents> | null}
        >
          <MainHeader heading={getServiceResource().service.displayName} />
          <Show when={getServiceResource().service.ConfigureView}>
            {getConfigureView => <Dynamic component={getConfigureView()} />}
          </Show>
        </ConfigureServiceConfigProvider>
      )}
    </Show>
  );
};
