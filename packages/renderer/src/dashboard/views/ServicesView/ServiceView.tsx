import { MainHeader } from '@/dashboard/components/MainHeader';
import { ServiceContainer } from '@/shared/components/ServiceContainer';
import { ConfigureServiceProvider } from '@/shared/context/ConfigureServiceContext';
import { useTranslate } from '@/shared/context/RuntimeContext';
import { useServiceResource } from '@/shared/context/ServiceContext';
import { Button } from '@/ui/dashboard/Button';
import { DashboardRoute, ServiceConfig, StoreContents } from '@pomello-desktop/domain';
import { useNavigate } from '@solidjs/router';
import { Component, Show } from 'solid-js';
import { Dynamic } from 'solid-js/web';

export const ServiceView: Component = () => {
  const getServiceResource = useServiceResource();
  const navigate = useNavigate();
  const t = useTranslate();

  const handleBackClick = () => {
    navigate(`/${DashboardRoute.Services}`);
  };

  return (
    <Show when={getServiceResource()}>
      {getServiceResource => (
        <ConfigureServiceProvider
          initialServiceConfig={getServiceResource().config as ServiceConfig<StoreContents> | null}
        >
          <ServiceContainer>
            <MainHeader heading={getServiceResource().service.displayName}>
              <Button variant="text" onClick={handleBackClick}>
                {t('backToServices')}
              </Button>
            </MainHeader>
            <Show when={getServiceResource().service.ConfigureView}>
              {getConfigureView => <Dynamic component={getConfigureView()} />}
            </Show>
          </ServiceContainer>
        </ConfigureServiceProvider>
      )}
    </Show>
  );
};
