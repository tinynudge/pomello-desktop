import { useConfigureService } from '@/shared/context/ConfigureServiceContext';
import { useTranslate } from '@/shared/context/RuntimeContext';
import { Button } from '@/ui/dashboard/Button';
import { Panel } from '@/ui/dashboard/Panel';
import { Component, Show } from 'solid-js';
import { createTrelloService } from '../createTrelloService';
import { TrelloConfigStore } from '../domain';
import styles from './ConnectionPanel.module.scss';

export const ConnectionPanel: Component = () => {
  const { serviceConfig, setServiceConfigValue } = useConfigureService<TrelloConfigStore>();
  const t = useTranslate();

  const handleLoginClick = () => {
    window.app.showAuthWindow({
      serviceId: createTrelloService.id,
      type: 'service',
    });
  };

  const handleLogoutClick = () => {
    setServiceConfigValue('token', undefined);
  };

  const getIsConnected = () => {
    return !!serviceConfig.token;
  };

  return (
    <Panel heading={t('service:connectionHeading')} padding="small">
      <div class={styles.connectionPanel}>
        <span>
          {t('service:connectionStatus', {
            status: t(`service:connectionStatus.${getIsConnected()}`),
          })}
        </span>
        <Show
          when={getIsConnected()}
          fallback={<Button onClick={handleLoginClick}>{t('service:login')}</Button>}
        >
          <Button onClick={handleLogoutClick}>{t('service:logout')}</Button>
        </Show>
      </div>
    </Panel>
  );
};
