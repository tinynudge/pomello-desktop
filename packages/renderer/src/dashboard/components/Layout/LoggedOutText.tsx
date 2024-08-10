import { Button } from '@/ui/dashboard/Button';
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
            <Button onClick={[handleAuthButtonClick, 'authorize']} variant="text">
              {props.children}
            </Button>
          ),
          signUp: props => (
            <Button onClick={[handleAuthButtonClick, 'register']} variant="text">
              {props.children}
            </Button>
          ),
        }}
        key="trackProductivityMessage"
      />
    </div>
  );
};
