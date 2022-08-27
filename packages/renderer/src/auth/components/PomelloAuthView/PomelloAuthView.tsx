import AuthView from '@/auth/ui/AuthView';
import useTranslation from '@/shared/hooks/useTranslation';
import { FC } from 'react';
import pomelloLogo from './assets/pomello.png';

const PomelloAuthView: FC = () => {
  const { t } = useTranslation();

  const handleTokenSubmit = async (token: string) => {
    const config = await window.app.getPomelloServiceConfig();

    config.set('token', token);
  };

  return (
    <AuthView>
      <AuthView.Instructions
        authUrl={`${import.meta.env.VITE_APP_URL}/api/authorize/`}
        heading={t('authPomelloHeading')}
        logo={pomelloLogo}
      />
      <AuthView.Form onSubmit={handleTokenSubmit} />
    </AuthView>
  );
};

export default PomelloAuthView;
