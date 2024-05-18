import { useTranslate } from '@/shared/context/RuntimeContext';
import { useService } from '@/shared/context/ServiceContext';
import { SerializableHttpError } from '@/shared/helpers/SerializableHttpError';
import { ButtonsOverlay } from '@/ui/components/ButtonsOverlay';
import { Component, createEffect } from 'solid-js';
import { useTrelloConfig } from '../TrelloRuntimeContext';

type TrelloAuthErrorProps = {
  error: SerializableHttpError;
  onTokenSet(): void;
};

export const TrelloAuthError: Component<TrelloAuthErrorProps> = props => {
  const config = useTrelloConfig();
  const getService = useService();
  const t = useTranslate();

  let didUnsetToken = false;

  createEffect(() => {
    const token = config.store.token;

    if (!token && !didUnsetToken) {
      didUnsetToken = true;
    } else if (token && didUnsetToken) {
      props.onTokenSet();
    }
  });

  const handleSignInClick = () => {
    openAuthWindow();
  };

  const handleDetailsClick = async () => {
    const { response } = await window.app.showMessageBox({
      message: t('authErrorDialogMessage', { service: getService().displayName }),
      cancelId: 2,
      defaultId: 0,
      buttons: [t('errorDialogSignIn'), t('errorDialogCopyError'), t('errorDialogCancel')],
      type: 'error',
    });

    if (response === 0) {
      openAuthWindow();
    } else if (response === 1) {
      window.app.writeClipboardText(props.error.toString());
    }
  };

  const openAuthWindow = () => {
    config.actions.tokenUnset();
    window.app.showAuthWindow({ type: 'service', serviceId: getService().id });
  };

  return (
    <ButtonsOverlay
      buttons={[
        { content: t('authErrorSignIn'), onClick: handleSignInClick },
        { content: t('errorDetails'), onClick: handleDetailsClick },
      ]}
    >
      {t('authErrorMessage')}
    </ButtonsOverlay>
  );
};
