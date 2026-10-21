import { useTranslate } from '@/shared/context/RuntimeContext';
import { Button } from '@/ui/dashboard/Button';
import { Modal } from '@/ui/dashboard/Modal';
import { Tooltip } from '@/ui/dashboard/Tooltip';
import { useBeforeLeave } from '@solidjs/router';
import { Component, Show, createSignal } from 'solid-js';
import { Portal } from 'solid-js/web';
import { saveSettingsBannerId } from '../Layout';
import { SaveButton } from './SaveButton';
import styles from './SaveChangesBanner.module.scss';

type SaveChangesBannerProps = {
  isSaveDisabled?: boolean;
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
            <Show when={props.isSaveDisabled} fallback={<SaveButton onClick={props.onSaveClick} />}>
              <Tooltip text={t('saveChangesUnresolvedErrors')}>
                {(tooltipTargetRef, tooltipId) => (
                  <SaveButton
                    disabled={props.isSaveDisabled}
                    onClick={props.onSaveClick}
                    ref={tooltipTargetRef}
                    tooltipId={tooltipId}
                  />
                )}
              </Tooltip>
            </Show>
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
