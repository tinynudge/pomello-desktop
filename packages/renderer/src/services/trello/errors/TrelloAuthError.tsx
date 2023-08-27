import ButtonsOverlay from '@/app/ui/ButtonsOverlay';
import SerializableHttpError from '@/shared/helpers/SerializableHttpError';
import useService from '@/shared/hooks/useService';
import useTranslation from '@/shared/hooks/useTranslation';
import { FC, useEffect, useRef } from 'react';
import { selectToken, useTrelloConfig } from '../useTrelloConfig';

interface TrelloAuthErrorProps {
  error: SerializableHttpError;
  onTokenSet(): void;
}

const TrelloAuthError: FC<TrelloAuthErrorProps> = ({ error, onTokenSet }) => {
  const { t } = useTranslation();
  const { displayName, id } = useService();

  const trelloConfig = useTrelloConfig();
  const token = trelloConfig(selectToken);

  const didUnsetToken = useRef(false);

  useEffect(() => {
    if (!token && !didUnsetToken.current) {
      didUnsetToken.current = true;
    } else if (token && didUnsetToken.current) {
      onTokenSet();
    }
  }, [onTokenSet, token]);

  const handleSignInClick = () => {
    openAuthWindow();
  };

  const handleDetailsClick = async () => {
    const { response } = await window.app.showMessageBox({
      message: t('authErrorDialogMessage', { service: displayName }),
      cancelId: 2,
      defaultId: 0,
      buttons: [t('errorDialogSignIn'), t('errorDialogCopyError'), t('errorDialogCancel')],
      type: 'error',
    });

    if (response === 0) {
      openAuthWindow();
    } else if (response === 1) {
      window.app.writeClipboardText(error.toString());
    }
  };

  const openAuthWindow = () => {
    trelloConfig.tokenUnset();

    window.app.showAuthWindow({ type: 'service', serviceId: id });
  };

  return (
    <ButtonsOverlay
      buttons={[
        { id: 'signIn', content: t('authErrorSignIn'), onClick: handleSignInClick },
        { id: 'details', content: t('errorDetails'), onClick: handleDetailsClick },
      ]}
    >
      {t('authErrorMessage')}
    </ButtonsOverlay>
  );
};

export default TrelloAuthError;
