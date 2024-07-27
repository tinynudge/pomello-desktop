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
            <button class={styles.button} onClick={() => handleAuthButtonClick('authorize')}>
              {props.children}
            </button>
          ),
          signUp: props => (
            <button class={styles.button} onClick={() => handleAuthButtonClick('register')}>
              {props.children}
            </button>
          ),
        }}
        key="trackProductivityMessage"
      />
    </div>
  );
};
