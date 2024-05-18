import { useHotkeys } from '@/app/context/HotkeysContext';
import { usePomelloActions } from '@/app/context/PomelloContext';
import { useStore } from '@/app/context/StoreContext';
import { useTranslate } from '@/shared/context/RuntimeContext';
import { DialAction } from '@pomello-desktop/domain';
import cc from 'classcat';
import { Component, For, JSX, Show, createEffect, createMemo, createSignal } from 'solid-js';
import { Dynamic } from 'solid-js/web';
import { AddNoteDialAction } from './AddNoteDialAction';
import { CompleteTaskDialAction } from './CompleteTaskDialAction';
import { Counter } from './Counter';
import styles from './Dial.module.scss';
import { DialActionProps } from './DialActionProps';
import { PauseTimerDialAction } from './PauseTimerDialAction';
import { SkipTimerDialAction } from './SkipTimerDialAction';
import { SwitchTaskDialAction } from './SwitchTaskDialAction';
import { VoidTaskDialAction } from './VoidTaskDialAction';
import MoreIcon from './assets/more.svg';

interface DialAttributes {
  label: string;
  onClick: JSX.EventHandler<HTMLButtonElement, MouseEvent>;
}

const DialActionsMap: Record<DialAction, Component<DialActionProps>> = {
  addNote: AddNoteDialAction,
  completeTask: CompleteTaskDialAction,
  pauseTimer: PauseTimerDialAction,
  skipTimer: SkipTimerDialAction,
  switchTask: SwitchTaskDialAction,
  voidTask: VoidTaskDialAction,
};

export const Dial: Component = () => {
  const { registerHotkeys } = useHotkeys();
  const { startTimer: startPomelloTimer } = usePomelloActions();
  const store = useStore();
  const t = useTranslate();

  const [getIsExpanded, setIsExpanded] = createSignal(false);
  const [getIsHoverable, setIsHoverable] = createSignal(false);

  const getIsActive = () => Boolean(store.pomelloState.timer?.isActive);

  const getIsPaused = () => Boolean(store.pomelloState.timer?.isPaused);

  const getDialAttributes = createMemo((): DialAttributes => {
    if (getIsExpanded()) {
      return {
        label: t('hideActionsLabel'),
        onClick: event => {
          event.currentTarget.blur();
          setIsExpanded(false);
        },
      };
    }

    if (getIsPaused()) {
      return {
        label: t('resumeTimerLabel'),
        onClick: event => {
          event.currentTarget.blur();
          startTimer();
        },
      };
    }

    if (getIsActive()) {
      return {
        label: t('showActionsLabel'),
        onClick: () => {
          setIsExpanded(true);
        },
      };
    }

    return {
      label: t('startTimerLabel'),
      onClick: event => {
        event.currentTarget.blur();
        startTimer();
      },
    };
  });

  const startTimer = () => {
    if (!getIsActive() || getIsPaused()) {
      startPomelloTimer();
    }
  };

  const setHoverTimeout = () => {
    // Eliminates the act warning when running the tests. We fix it here rather
    // than in the test, because running pending timers inside the tests causes
    // other side-effects that can cause problems in test (ie dial will tick).
    if (import.meta.env.MODE === 'test') {
      setIsHoverable(true);
    } else {
      setIsHoverable(false);

      setTimeout(() => {
        setIsHoverable(true);
      }, 750);
    }
  };

  createEffect(() => {
    if (getIsActive() && !getIsPaused()) {
      setHoverTimeout();
    } else if (!getIsActive()) {
      setIsHoverable(false);
    }
  });

  const handleActionClick = () => {
    setIsExpanded(false);
  };

  const handleOverlayClick = () => {
    setIsExpanded(false);
  };

  registerHotkeys({ startTimer });

  return (
    <Show when={store.pomelloState.timer?.type}>
      <div
        class={cc({
          [styles.container]: true,
          [styles.isExpanded]: getIsExpanded(),
        })}
        data-testid="dial"
      >
        <button
          aria-label={getDialAttributes().label}
          class={cc({
            [styles.dial]: true,
            [styles.isActive]: getIsActive(),
            [styles.isHoverable]: getIsHoverable(),
          })}
          onClick={event => getDialAttributes().onClick(event)}
        >
          <div aria-hidden={getIsActive()} class={styles.panel}>
            {t('startTimer')}
          </div>
          <div
            aria-hidden={!getIsActive()}
            class={cc({
              [styles.panel]: true,
              [styles.isPaused]: getIsPaused(),
            })}
          >
            <Counter />
          </div>
          {getIsPaused() && <div class={styles.panel}>{t('resumeTimer')}</div>}
          <div aria-hidden={!getIsActive()} class={styles.panel}>
            <MoreIcon width={18} />
          </div>
        </button>
        <div class={styles.actions}>
          <For each={store.dialActions}>
            {action => (
              <Dynamic
                class={styles.action}
                component={DialActionsMap[action]}
                isVisible={getIsExpanded()}
                onClick={handleActionClick}
              />
            )}
          </For>
        </div>
      </div>
      <div
        class={cc({
          [styles.overlay]: true,
          [styles.isVisible]: getIsExpanded(),
        })}
        data-testid="dial-overlay"
        onClick={handleOverlayClick}
        role="presentation"
      />
    </Show>
  );
};
