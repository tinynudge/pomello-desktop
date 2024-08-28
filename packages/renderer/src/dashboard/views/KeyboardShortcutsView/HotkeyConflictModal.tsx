import { HotkeyConflictError, useDashboard } from '@/dashboard/context/DashboardContext';
import { useTranslate } from '@/shared/context/RuntimeContext';
import { Modal } from '@/ui/dashboard/Modal';
import { Component, onCleanup, onMount } from 'solid-js';

type HotkeyConflictModalProps = {
  clearError(): void;
  error: HotkeyConflictError;
};

export const HotkeyConflictModal: Component<HotkeyConflictModalProps> = props => {
  const { stageHotkey } = useDashboard();
  const t = useTranslate();

  onMount(() => {
    conflictingHotkeyModalRef.showModal();

    conflictingHotkeyModalRef.addEventListener('close', handleModalClose);

    onCleanup(() => {
      conflictingHotkeyModalRef.removeEventListener('close', handleModalClose);
    });
  });

  const handleModalClose = () => {
    props.clearError();
  };

  const handleOverwriteClick = () => {
    stageHotkey(props.error.currentCommand, false);
    stageHotkey(props.error.incomingCommand, props.error.hotkey);
  };

  let conflictingHotkeyModalRef: HTMLDialogElement;

  return (
    <Modal
      buttons={[
        {
          children: t('overwrite'),
          onClick: handleOverwriteClick,
          variant: 'primary',
        },
        {
          autofocus: true,
          children: t('cancel'),
        },
      ]}
      heading={t('conflictingHotkeyHeading')}
      ref={conflictingHotkeyModalRef!}
    >
      <p>
        {t('conflictingHotkeyText', {
          binding: props.error.hotkey.label,
          currentCommand: t(`hotkeys.${props.error.currentCommand}.label`),
          incomingCommand: t(`hotkeys.${props.error.incomingCommand}.label`),
        })}
      </p>
    </Modal>
  );
};
