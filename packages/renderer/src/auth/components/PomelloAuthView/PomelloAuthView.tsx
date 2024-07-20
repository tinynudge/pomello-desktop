import { AuthView } from '@/auth/ui/AuthView';
import { usePomelloConfig, useTranslate } from '@/shared/context/RuntimeContext';
import { Component } from 'solid-js';
import pomelloLogo from './assets/pomello.png';

type PomelloAuthViewProps = {
  action: 'authorize' | 'register';
};

export const PomelloAuthView: Component<PomelloAuthViewProps> = props => {
  const config = usePomelloConfig();
  const t = useTranslate();

  const handleTokenSubmit = async (input: string) => {
    const { pomelloToken } = JSON.parse(window.atob(input));
    const encryptedToken = window.app.encryptValue(pomelloToken);

    config.actions.tokenUpdated(encryptedToken);
  };

  return (
    <AuthView>
      <AuthView.Instructions
        authUrl={`${import.meta.env.VITE_APP_URL}/api/${props.action}/`}
        heading={t('authPomelloHeading')}
        logo={pomelloLogo}
      />
      <AuthView.Form onSubmit={handleTokenSubmit} />
    </AuthView>
  );
};
