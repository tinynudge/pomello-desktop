import { useTranslate } from '@/shared/context/RuntimeContext';
import { createEffect, createSignal, onCleanup, onMount } from 'solid-js';
import { ToastVariant } from './ToastContext';
import styles from './ToastItem.module.scss';

type Timer = {
  id: number;
  startedAt: number;
};

type ToastItemProps = {
  initialDuration: number;
  message: string;
  onDismiss(): void;
  variant: ToastVariant;
};

export const ToastItem = (props: ToastItemProps) => {
  const t = useTranslate();

  const [getState, setState] = createSignal<'entering' | 'visible' | 'exiting'>('entering');

  let remainingDuration = props.initialDuration;
  let timer: Timer | null = null;

  let isFocused = false;
  let isHovered = false;
  let isVisible = document.visibilityState === 'visible';

  onMount(() => {
    document.addEventListener('visibilitychange', handleVisibilityChange);

    onCleanup(() => {
      if (timer) {
        clearTimeout(timer.id);
      }

      document.removeEventListener('visibilitychange', handleVisibilityChange);
    });
  });

  createEffect(() => {
    if (getState() === 'visible') {
      createTimer();
    }
  });

  const handleAnimationEnd = () => {
    const state = getState();

    if (state === 'entering') {
      setState('visible');
    } else if (state === 'exiting') {
      props.onDismiss();
    }
  };

  const handleVisibilityChange = () => {
    isVisible = document.visibilityState === 'visible';

    if (!isVisible) {
      pauseTimer();
    } else {
      resumeTimer();
    }
  };

  const handleFocusIn = () => {
    isFocused = true;

    pauseTimer();
  };

  const handleFocusOut = () => {
    isFocused = false;

    resumeTimer();
  };

  const handleMouseEnter = () => {
    isHovered = true;

    pauseTimer();
  };

  const handleMouseLeave = () => {
    isHovered = false;

    resumeTimer();
  };

  const createTimer = () => {
    if (timer) {
      clearTimeout(timer.id);
    }

    const timeoutId = window.setTimeout(removeToast, remainingDuration);

    timer = {
      id: timeoutId,
      startedAt: Date.now(),
    };
  };

  const pauseTimer = () => {
    if (!timer) {
      return;
    }

    remainingDuration -= Date.now() - timer.startedAt;

    clearTimeout(timer.id);
    timer = null;
  };

  const resumeTimer = () => {
    if (timer || isFocused || isHovered || !isVisible) {
      return;
    }

    createTimer();
  };

  const removeToast = () => {
    if (timer) {
      clearTimeout(timer.id);
      timer = null;
    }

    setState('exiting');
  };

  return (
    <div
      classList={{
        [styles.toast]: true,
        [styles.exiting]: getState() === 'exiting',
      }}
      data-variant={props.variant}
      onAnimationEnd={handleAnimationEnd}
      onFocusIn={handleFocusIn}
      onFocusOut={handleFocusOut}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <span class={styles.srOnly}>{t(`toastPrefix.${props.variant}`)}</span>
      <span class={styles.message}>{props.message}</span>
      <button
        aria-label={t('toastDismissLabel', { message: props.message })}
        class={styles.dismiss}
        onClick={removeToast}
        type="button"
      >
        &times;
      </button>
    </div>
  );
};
