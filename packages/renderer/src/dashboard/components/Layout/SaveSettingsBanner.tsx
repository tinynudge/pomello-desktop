import { useDashboard } from '@/dashboard/context/DashboardContext';
import { useTranslate } from '@/shared/context/RuntimeContext';
import { Button } from '@/ui/dashboard/Button';
import { Component } from 'solid-js';
import styles from './SaveSettingsBanner.module.scss';

export const SaveSettingsBanner: Component = () => {
  const { clearStagedSettings, commitStagedSettings } = useDashboard();
  const t = useTranslate();

  return (
    <div class={styles.saveSettingsBanner}>
      <p role="status">{t('pendingChangesBanner')}</p>
      <div class={styles.actions}>
        <Button aria-label={t('undoChangesLabel')} onClick={clearStagedSettings}>
          {t('undoChanges')}
        </Button>
        <Button aria-label={t('saveChangesLabel')} onClick={commitStagedSettings} variant="primary">
          {t('saveChanges')}
        </Button>
      </div>
    </div>
  );
};
