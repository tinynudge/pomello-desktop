import { useAuthView } from '@/auth/context/AuthViewProvider';
import { useTranslate } from '@/shared/context/RuntimeContext';
import cc from 'classcat';
import { Component, JSX, createSignal } from 'solid-js';
import styles from './AuthViewForm.module.scss';

type AuthViewFormProps = {
  onSubmit(token: string): Promise<void> | void;
};

export const AuthViewForm: Component<AuthViewFormProps> = props => {
  const t = useTranslate();

  const { onTokenSave } = useAuthView();

  const [getToken, setToken] = createSignal('');
  const [getHasError, setHasError] = createSignal(false);

  const handleTokenChange: JSX.EventHandler<HTMLTextAreaElement, InputEvent> = event => {
    if (getHasError()) {
      setHasError(false);
    }

    setToken(event.currentTarget.value);
  };

  const handleTokenSubmit = async () => {
    if (!getToken().length) {
      setHasError(true);

      return;
    }

    await props.onSubmit(getToken());

    onTokenSave();
  };

  return (
    <>
      <div class={styles.tokenInput}>
        <textarea
          class={cc({ [styles.hasError]: getHasError() })}
          onInput={handleTokenChange}
          placeholder={t('insertTokenPlaceholder')}
          value={getToken()}
        />
        {getHasError() && (
          <p class={styles.errorMessage} role="alert">
            {t('validAuthTokenRequired')}
          </p>
        )}
      </div>
      <button class={styles.button} onClick={handleTokenSubmit}>
        {t('submitToken')}
      </button>
    </>
  );
};
