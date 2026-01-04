import { MainHeader } from '@/dashboard/components/MainHeader';
import { useRuntime, useTranslate } from '@/shared/context/RuntimeContext';
import { Button } from '@/ui/dashboard/Button';
import { Panel } from '@/ui/dashboard/Panel';
import { DashboardRoute } from '@pomello-desktop/domain';
import { useNavigate } from '@solidjs/router';
import { For, Show } from 'solid-js';
import styles from './ServicesView.module.scss';

export const ServicesView = () => {
  const { services } = useRuntime();
  const navigate = useNavigate();
  const t = useTranslate();

  const handleConfigureClick = (serviceId: string) => {
    navigate(`/${DashboardRoute.Services}/${serviceId}`);
  };

  return (
    <>
      <MainHeader heading={t('routeServices')} />
      <Panel heading={t('allServicesHeader')} isPaddingDisabled>
        <Panel.List aria-label={t('allServicesLabel')}>
          <For each={Object.values(services)}>
            {service => (
              <Panel.List.Item aria-label={service.displayName} class={styles.serviceListItem}>
                <span>{service.displayName}</span>
                <Show when={service.hasConfigureView}>
                  <Button onClick={[handleConfigureClick, service.id]}>
                    {t('configureService')}
                  </Button>
                </Show>
              </Panel.List.Item>
            )}
          </For>
        </Panel.List>
      </Panel>
    </>
  );
};
