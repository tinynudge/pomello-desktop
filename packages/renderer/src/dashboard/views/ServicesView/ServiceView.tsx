import { MainHeader } from '@/dashboard/components/MainHeader';
import { ServiceContainer } from '@/shared/components/ServiceContainer';
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
          <ServiceContainer>
            <MainHeader heading={getServiceResource().service.displayName} />
            <Show when={getServiceResource().service.ConfigureView}>
              {getConfigureView => <Dynamic component={getConfigureView()} />}
            </Show>
          </ServiceContainer>
        </ConfigureServiceConfigProvider>
      )}
    </Show>
  );
};
