import { useTranslate } from '@/shared/context/RuntimeContext';
import { Button } from '@/ui/dashboard/Button';
import { Translate } from '@/ui/shared/Translate';
import { Component } from 'solid-js';
import styles from './LoginView.module.scss';

export const LoginView: Component = () => {
  const t = useTranslate();

  const handleAuthButtonClick = (action: 'authorize' | 'register') => {
    window.app.showAuthWindow({
      action,
      type: 'pomello',
    });
  };

  return (
    <div class={styles.loginView} data-testid="login-view">
      <p>{t('loginRequiredMessage')}</p>
      <Button variant="primary" onClick={[handleAuthButtonClick, 'authorize']}>
        {t('logIn')}
      </Button>
      <p>
        <Translate
          key="loginRequiredSignUpMessage"
          components={{
            signUp: props => (
              <Button variant="text" onClick={[handleAuthButtonClick, 'register']}>
                {props.children}
              </Button>
            ),
          }}
        />
      </p>
    </div>
  );
};
