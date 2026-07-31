import { useTranslate } from '@/shared/context/RuntimeContext';
import { Button } from '@/ui/dashboard/Button';
import { Modal } from '@/ui/dashboard/Modal';
import { useBeforeLeave } from '@solidjs/router';
import { Component, Show, createSignal } from 'solid-js';
import { Portal } from 'solid-js/web';
import { saveSettingsBannerId } from '../Layout';
import styles from './SaveChangesBanner.module.scss';

type SaveChangesBannerProps = {
  onSaveClick(): void;
  onUndoClick(): void;
};

export const SaveChangesBanner: Component<SaveChangesBannerProps> = props => {
  const t = useTranslate();

  const [getConfirmNavigation, setConfirmNavigation] = createSignal<(() => void) | undefined>(
    undefined
  );

  useBeforeLeave(event => {
    event.preventDefault();

    setConfirmNavigation(() => () => {
      event.retry(true);
    });
  });

  const handleDiscardConfirm = () => {
    props.onUndoClick();

    getConfirmNavigation()?.();
  };

  const handleCancelClick = () => {
    setConfirmNavigation(undefined);
  };

  return (
    <>
      <Portal mount={document.querySelector(`#${saveSettingsBannerId}`) ?? undefined}>
        <div class={styles.saveChangesBanner}>
          <p data-testid="pending-changes" role="status">
            {t('pendingChangesBanner')}
          </p>
          <div class={styles.actions}>
            <Button aria-label={t('undoChangesLabel')} onClick={props.onUndoClick}>
              {t('undoChanges')}
            </Button>
            <Button
              aria-label={t('saveChangesLabel')}
              onClick={props.onSaveClick}
              variant="primary"
            >
              {t('saveChanges')}
            </Button>
          </div>
        </div>
      </Portal>
      <Show when={getConfirmNavigation()}>
        <Modal
          buttons={[
            {
              children: t('unsavedChangesConfirm'),
              onClick: handleDiscardConfirm,
              variant: 'danger',
            },
            {
              autofocus: true,
              children: t('cancel'),
            },
          ]}
          heading={t('unsavedChangesHeading')}
          onHide={handleCancelClick}
          showOnMount
        >
          <p>{t('unsavedChangesMessage')}</p>
        </Modal>
      </Show>
    </>
  );
};
