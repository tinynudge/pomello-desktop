import useAuthView from '@/auth/hooks/useAuthView';
import useTranslation from '@/shared/hooks/useTranslation';
import cc from 'classcat';
import { ChangeEvent, FC, useState } from 'react';
import styles from './AuthViewForm.module.scss';

interface AuthViewFormProps {
  onSubmit(token: string): Promise<void> | void;
}

const AuthViewForm: FC<AuthViewFormProps> = ({ onSubmit }) => {
  const { t } = useTranslation();

  const { onTokenSave } = useAuthView();

  const [token, setToken] = useState('');
  const [hasError, setHasError] = useState(false);

  const handleTokenChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    if (hasError) {
      setHasError(false);
    }

    setToken(event.currentTarget.value);
  };

  const handleTokenSubmit = async () => {
    if (!token.length) {
      setHasError(true);

      return;
    }

    await onSubmit(token);

    onTokenSave();
  };

  return (
    <>
      <div className={styles.tokenInput}>
        <textarea
          className={cc({ [styles.hasError]: hasError })}
          onChange={handleTokenChange}
          placeholder={t('insertTokenPlaceholder')}
          value={token}
        />
        {hasError && (
          <p className={styles.errorMessage} role="alert">
            {t('validAuthTokenRequired')}
          </p>
        )}
      </div>
      <button className={styles.button} onClick={handleTokenSubmit}>
        {t('submitToken')}
      </button>
    </>
  );
};

export default AuthViewForm;
