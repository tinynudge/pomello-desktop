import { usePomelloConfig, useSettings, useTranslate } from '@/shared/context/RuntimeContext';
import { ButtonLink } from '@/ui/dashboard/ButtonLink';
import { Translate } from '@/ui/shared/Translate';
import { Component, Show } from 'solid-js';
import styles from './SyncDetails.module.scss';

export const SyncDetails: Component = () => {
  const pomelloConfig = usePomelloConfig();
  const settings = useSettings();
  const t = useTranslate();

  const handleLogInButtonClick = () => {
    window.app.showAuthWindow({
      action: 'authorize',
      type: 'pomello',
    });
  };

  return (
    <div class={styles.syncDetails}>
      <Show when={settings.timestamp}>
        {getTimestamp => (
          <small>{t('lastSyncDate', { date: new Date(getTimestamp()).toLocaleString() })}</small>
        )}
      </Show>
      <Show when={!pomelloConfig.store.user}>
        <small data-testid="settings-sync-disabled">
          <Translate
            components={{
              logIn: props => (
                <ButtonLink onClick={handleLogInButtonClick}>{props.children}</ButtonLink>
              ),
            }}
            key="settingsSyncDisabled"
          />
        </small>
      </Show>
    </div>
  );
};
