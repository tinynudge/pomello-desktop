import { ButtonLink } from '@/ui/dashboard/ButtonLink';
import { Translate } from '@/ui/shared/Translate';
import { Component } from 'solid-js';
import styles from './LoggedOutText.module.scss';

export const LoggedOutText: Component = () => {
  const handleAuthButtonClick = (action: 'authorize' | 'register') => {
    window.app.showAuthWindow({
      type: 'pomello',
      action,
    });
  };

  return (
    <div class={styles.loggedOutText}>
      <Translate
        components={{
          logIn: props => (
            <ButtonLink onClick={() => handleAuthButtonClick('authorize')}>
              {props.children}
            </ButtonLink>
          ),
          signUp: props => (
            <ButtonLink onClick={() => handleAuthButtonClick('register')}>
              {props.children}
            </ButtonLink>
          ),
        }}
        key="trackProductivityMessage"
      />
    </div>
  );
};
