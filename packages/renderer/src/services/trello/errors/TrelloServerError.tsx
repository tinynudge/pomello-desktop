import { useTranslate } from '@/shared/context/RuntimeContext';
import { SerializableHttpError } from '@/shared/helpers/SerializableHttpError';
import { ButtonsOverlay } from '@/ui/components/ButtonsOverlay';
import { Component } from 'solid-js';

interface TrelloServerErrorProps {
  error: SerializableHttpError;
  onRetry(): void;
}

export const TrelloServerError: Component<TrelloServerErrorProps> = props => {
  const t = useTranslate();

  const handleDetailsClick = async () => {
    const { response } = await window.app.showMessageBox({
      message: t('service:serverErrorMessage'),
      cancelId: 1,
      defaultId: 0,
      buttons: [t('errorDialogCopyError'), t('errorDialogCancel')],
      type: 'error',
    });

    if (response === 0) {
      window.app.writeClipboardText(props.error.toString());
    }
  };

  return (
    <ButtonsOverlay
      buttons={[
        { content: t('errorRetry'), onClick: props.onRetry },
        { content: t('errorDetails'), onClick: handleDetailsClick },
      ]}
    >
      {t('genericErrorMessage')}
    </ButtonsOverlay>
  );
};
