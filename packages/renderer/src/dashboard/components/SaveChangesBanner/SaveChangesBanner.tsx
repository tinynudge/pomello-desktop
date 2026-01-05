import { useTranslate } from '@/shared/context/RuntimeContext';
import { Button } from '@/ui/dashboard/Button';
import { Component } from 'solid-js';
import { Portal } from 'solid-js/web';
import { saveSettingsBannerId } from '../Layout';
import styles from './SaveChangesBanner.module.scss';

type SaveChangesBannerProps = {
  onSaveClick(): void;
  onUndoClick(): void;
};

export const SaveChangesBanner: Component<SaveChangesBannerProps> = props => {
  const t = useTranslate();

  return (
    <Portal mount={document.querySelector(`#${saveSettingsBannerId}`) ?? undefined}>
      <div class={styles.saveChangesBanner}>
        <p role="status">{t('pendingChangesBanner')}</p>
        <div class={styles.actions}>
          <Button aria-label={t('undoChangesLabel')} onClick={props.onUndoClick}>
            {t('undoChanges')}
          </Button>
          <Button aria-label={t('saveChangesLabel')} onClick={props.onSaveClick} variant="primary">
            {t('saveChanges')}
          </Button>
        </div>
      </div>
    </Portal>
  );
};
