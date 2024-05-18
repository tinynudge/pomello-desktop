import { useTranslate } from '@/shared/context/RuntimeContext';
import { JSX, ParentComponent, Show } from 'solid-js';
import styles from './AuthViewInstructions.module.scss';

interface AuthViewInstructionsProps {
  authUrl?: string;
  heading?: string;
  logo?: JSX.Element;
}

export const AuthViewInstructions: ParentComponent<AuthViewInstructionsProps> = props => {
  const t = useTranslate();

  const handleLinkClick: JSX.EventHandler<HTMLAnchorElement, MouseEvent> = event => {
    event.preventDefault();
    window.app.openUrl(event.currentTarget.href);
  };

  return (
    <div class={styles.instructions}>
      <Show fallback={props.logo} when={typeof props.logo === 'string' && props.logo}>
        {logoSrc => <img class={styles.logo} src={logoSrc()} alt="" width={128} height={128} />}
      </Show>
      <Show when={props.heading}>
        {getHeading => <h1 class={styles.heading}>{getHeading()}</h1>}
      </Show>
      <Show when={props.authUrl}>
        {getAuthUrl => (
          <>
            <p>{t('authInstructions')}</p>
            <a href={getAuthUrl()} onClick={handleLinkClick}>
              {getAuthUrl()}
            </a>
          </>
        )}
      </Show>
      {props.children}
    </div>
  );
};
