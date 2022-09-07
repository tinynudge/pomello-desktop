import ButtonsLayout from '@/app/ui/ButtonsOverlay';
import useService from '@/shared/hooks/useService';
import useTranslation from '@/shared/hooks/useTranslation';
import { FC } from 'react';

const LoginView: FC = () => {
  const { t } = useTranslation();
  const { displayName, id } = useService();

  return (
    <ButtonsLayout
      buttons={[
        {
          id: 'connect',
          content: t('signIn'),
          onClick: () => window.app.showAuthWindow(id),
        },
      ]}
    >
      <p>{t('connectToService', { service: displayName })}</p>
    </ButtonsLayout>
  );
};

export default LoginView;
