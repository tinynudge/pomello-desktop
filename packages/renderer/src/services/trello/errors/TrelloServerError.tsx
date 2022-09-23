import ButtonsOverlay from '@/app/ui/ButtonsOverlay';
import useTranslation from '@/shared/hooks/useTranslation';
import { AxiosError } from 'axios';
import { FC } from 'react';
import sanitizeTrelloError from './sanitizeTrelloError';

interface TrelloServerErrorProps {
  error: AxiosError;
  onRetry(): void;
}

const TrelloServerError: FC<TrelloServerErrorProps> = ({ error, onRetry }) => {
  const { t } = useTranslation();

  const handleDetailsClick = async () => {
    const { response } = await window.app.showMessageBox({
      message: t('service:serverErrorMessage'),
      cancelId: 1,
      defaultId: 0,
      buttons: [t('errorDialogCopyError'), t('errorDialogCancel')],
      type: 'error',
    });

    if (response === 0) {
      window.app.writeClipboardText(JSON.stringify(sanitizeTrelloError(error), null, 2));
    }
  };

  return (
    <ButtonsOverlay
      buttons={[
        { id: 'retry', content: t('errorRetry'), onClick: onRetry },
        { id: 'details', content: t('errorDetails'), onClick: handleDetailsClick },
      ]}
    >
      {t('genericErrorMessage')}
    </ButtonsOverlay>
  );
};

export default TrelloServerError;
