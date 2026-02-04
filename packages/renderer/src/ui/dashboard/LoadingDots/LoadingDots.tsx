import { Component } from 'solid-js';
import styles from './LoadingDots.module.scss';
import { useTranslate } from '@/shared/context/RuntimeContext';

type LoadingDotsProps = {
  class?: string;
};

export const LoadingDots: Component<LoadingDotsProps> = props => {
  const t = useTranslate();

  return (
    <div
      aria-label={t('loading')}
      aria-live="polite"
      class={props.class}
      classList={{ [styles.loadingDots]: true }}
      role="status"
    >
      <div class={styles.dot} />
      <div class={styles.dot} />
      <div class={styles.dot} />
    </div>
  );
};
