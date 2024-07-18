import { useTranslate } from '@/shared/context/RuntimeContext';
import { ButtonsOverlay } from '@/ui/app/ButtonsOverlay';
import { Component } from 'solid-js';

interface ErrorOverlayProps {
  error: Error;
  resetErrorBoundary(): void;
}

export const ErrorOverlay: Component<ErrorOverlayProps> = props => {
  const t = useTranslate();

  const handleDetailsClick = async () => {
    const { response } = await window.app.showMessageBox({
      message: t('unexpectedErrorTitle', { message: props.error.message }),
      cancelId: 1,
      defaultId: 0,
      buttons: [t('errorDialogCopyError'), t('errorDialogCancel')],
      type: 'error',
    });

    if (response === 0) {
      const serializedError = {
        type: props.error.name,
        message: props.error.message,
        stack: props.error.stack?.split('\n'),
      };

      window.app.writeClipboardText(JSON.stringify(serializedError, null, 2));
    }
  };

  return (
    <ButtonsOverlay
      buttons={[
        { content: t('errorRetry'), onClick: props.resetErrorBoundary },
        { content: t('errorDetails'), onClick: handleDetailsClick },
      ]}
    >
      {t('genericErrorMessage')}
    </ButtonsOverlay>
  );
};
