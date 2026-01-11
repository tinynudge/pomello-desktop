import { useTranslate } from '@/shared/context/RuntimeContext';
import { Component } from 'solid-js';
import { Button } from '../Button';
import SadPomeloIllustration from './assets/sad-pomelo.svg';
import styles from './Error.module.scss';

type ErrorProps = {
  error: Error;
  message?: string;
  retry(): void;
};

export const Error: Component<ErrorProps> = props => {
  const t = useTranslate();

  const handleDetailsClick = async () => {
    const { response } = await window.app.showMessageBox({
      message: t('unexpectedErrorTitle', { message: props.error.message }),
      cancelId: 1,
      defaultId: 0,
      buttons: [t('errorDialogCopyError'), t('errorDialogCancel')],
      type: 'error',
    });

    if (response === 0) {
      const serializedError = {
        type: props.error.name,
        message: props.error.message,
        stack: props.error.stack?.split('\n'),
      };

      window.app.writeClipboardText(JSON.stringify(serializedError, null, 2));
    }
  };

  return (
    <div class={styles.error}>
      <SadPomeloIllustration class={styles.illustration} />
      <p>{props.message ?? t('errorMessage')}</p>
      <div class={styles.buttons}>
        <Button onClick={handleDetailsClick}>{t('errorDetails')}</Button>
        <Button onClick={props.retry} variant="primary">
          {t('errorRetry')}
        </Button>
      </div>
    </div>
  );
};
