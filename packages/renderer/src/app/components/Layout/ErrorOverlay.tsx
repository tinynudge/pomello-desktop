import ButtonsOverlay from '@/app/ui/ButtonsOverlay';
import useTranslation from '@/shared/hooks/useTranslation';
import { FC } from 'react';

interface ErrorOverlayProps {
  error: Error;
  resetErrorBoundary(): void;
}

const ErrorOverlay: FC<ErrorOverlayProps> = ({ error, resetErrorBoundary }) => {
  const { t } = useTranslation();

  const handleDetailsClick = async () => {
    const { response } = await window.app.showMessageBox({
      message: t('unexpectedErrorTitle', { message: error.message }),
      cancelId: 1,
      defaultId: 0,
      buttons: [t('errorDialogCopyError'), t('errorDialogCancel')],
      type: 'error',
    });

    if (response === 0) {
      const serializedError = {
        type: error.name,
        message: error.message,
        stack: error.stack?.split('\n'),
      };

      window.app.writeClipboardText(JSON.stringify(serializedError, null, 2));
    }
  };

  return (
    <ButtonsOverlay
      buttons={[
        { id: 'retry', content: t('errorRetry'), onClick: resetErrorBoundary },
        { id: 'details', content: t('errorDetails'), onClick: handleDetailsClick },
      ]}
    >
      {t('genericErrorMessage')}
    </ButtonsOverlay>
  );
};

export default ErrorOverlay;
