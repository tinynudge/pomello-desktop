import { useConfigureService } from '@/shared/context/ConfigureServiceContext';
import { useTranslate } from '@/shared/context/RuntimeContext';
import { Button } from '@/ui/dashboard/Button';
import { Panel } from '@/ui/dashboard/Panel';
import { Component, Show } from 'solid-js';
import { TrelloConfigStore } from '../domain';
import styles from './BoardListPreferencesPanel.module.scss';

type BoardListPreferencesPanelProps = {
  onLoginClick(): void;
};

export const BoardListPreferencesPanel: Component<BoardListPreferencesPanelProps> = props => {
  const { getServiceConfigValue } = useConfigureService<TrelloConfigStore>();
  const t = useTranslate();

  const getHasToken = () => !!getServiceConfigValue('token');

  return (
    <Panel heading={t('service:boardListPreferencesHeading')} padding={'large'}>
      <Show
        when={getHasToken()}
        fallback={
          <div class={styles.fallbackContent}>
            <p>{t('service:boardListPreferencesAccountRequired')}</p>
            <Button onClick={props.onLoginClick} variant="primary">
              {t('service:login')}
            </Button>
          </div>
        }
      >
        <>{/* Placeholder */}</>
      </Show>
    </Panel>
  );
};
