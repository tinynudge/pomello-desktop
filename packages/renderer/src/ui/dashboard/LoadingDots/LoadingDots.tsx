import { Component } from 'solid-js';
import styles from './LoadingDots.module.scss';
import { useTranslate } from '@/shared/context/RuntimeContext';

export const LoadingDots: Component = () => {
  const t = useTranslate();

  return (
    <div aria-label={t('loading')} aria-live="polite" class={styles.loadingDots} role="status">
      <div class={styles.dot} />
      <div class={styles.dot} />
      <div class={styles.dot} />
    </div>
  );
};
