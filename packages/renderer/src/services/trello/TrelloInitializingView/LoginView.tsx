import { useTranslate } from '@/shared/context/RuntimeContext';
import { useService } from '@/shared/context/ServiceContext';
import { ButtonsOverlay } from '@/ui/components/ButtonsOverlay';
import { Component } from 'solid-js';

export const LoginView: Component = () => {
  const t = useTranslate();
  const getService = useService();

  return (
    <ButtonsOverlay
      buttons={[
        {
          content: t('signIn'),
          onClick: () => window.app.showAuthWindow({ type: 'service', serviceId: getService().id }),
        },
      ]}
    >
      <p>{t('connectToService', { service: getService().displayName })}</p>
    </ButtonsOverlay>
  );
};
