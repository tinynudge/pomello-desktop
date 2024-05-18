import { useTranslate } from '@/shared/context/RuntimeContext';
import { Component, createEffect, createSignal, onCleanup } from 'solid-js';

export const SuccessMessage: Component = () => {
  const t = useTranslate();

  const [getCount, setCount] = createSignal(10);
  let timeoutRef: number | null = null;

  createEffect(() => {
    if (getCount() !== 0) {
      timeoutRef = window.setTimeout(() => {
        setCount(previousCount => previousCount - 1);
      }, 1000);
    } else {
      window.close();
    }
  });

  onCleanup(() => {
    if (timeoutRef) {
      clearTimeout(timeoutRef);
    }
  });

  return (
    <>
      <p>{t('authSuccessMessage')}</p>
      <br />
      <p>{t('authCloseMessage', { count: `${getCount()}` })}</p>
    </>
  );
};
