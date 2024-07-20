import { useMaybeService } from '@/shared/context/ServiceContext';
import { AuthWindowType } from '@pomello-desktop/domain';
import { Component, Match, Show, Switch, createSignal } from 'solid-js';
import { Dynamic } from 'solid-js/web';
import styles from './Auth.module.scss';
import { PomelloAuthView } from './components/PomelloAuthView';
import { SuccessMessage } from './components/SuccessMessage';
import { AuthViewProvider } from './context/AuthViewProvider';

type AuthProps = {
  authWindow: AuthWindowType;
};

export const Auth: Component<AuthProps> = props => {
  const getService = useMaybeService();

  const [getDidSaveToken, setDidSaveToken] = createSignal(false);

  const handleTokenSave = () => {
    setDidSaveToken(true);
  };

  return (
    <div class={styles.container}>
      <Show when={!getDidSaveToken()} fallback={<SuccessMessage />}>
        <AuthViewProvider defaultOnTokenSave={handleTokenSave}>
          <Switch>
            <Match when={props.authWindow.type === 'pomello' && props.authWindow}>
              {getAuthWindow => <PomelloAuthView action={getAuthWindow().action} />}
            </Match>
            <Match when={getService()?.AuthView}>
              {getAuthView => <Dynamic component={getAuthView()} />}
            </Match>
          </Switch>
        </AuthViewProvider>
      </Show>
    </div>
  );
};
