import useDialActions from '@/app/hooks/useDialActions';
import useHotkeys from '@/app/hooks/useHotkeys';
import usePomelloActions from '@/app/hooks/usePomelloActions';
import useTranslation from '@/shared/hooks/useTranslation';
import { DialActionClickHandler } from '@domain';
import { Timer } from '@tinynudge/pomello-service';
import cc from 'classcat';
import { FC, MouseEvent, useCallback, useEffect, useState } from 'react';
import { ReactComponent as MoreIcon } from './assets/more.svg';
import Counter from './Counter';
import styles from './DialContent.module.scss';

interface DialContentProps {
  timer: Timer;
}

const DialContent: FC<DialContentProps> = ({ timer }) => {
  const { t } = useTranslation();
  const { registerHotkeys } = useHotkeys();

  const { dialActions } = useDialActions();
  const { startTimer: startPomelloTimer } = usePomelloActions();

  const [isExpanded, setIsExpanded] = useState(false);
  const [isHoverable, setIsHoverable] = useState(false);

  const startTimer = useCallback(() => {
    if (!timer.isActive || timer.isPaused) {
      startPomelloTimer();
    }
  }, [startPomelloTimer, timer.isActive, timer.isPaused]);

  useEffect(() => {
    if (timer.isActive && !timer.isPaused) {
      setHoverTimeout();
    } else if (!timer.isActive) {
      setIsHoverable(false);
    }
  }, [timer.isActive, timer.isPaused]);

  useEffect(() => {
    return registerHotkeys({
      startTimer,
    });
  }, [registerHotkeys, startTimer]);

  let dialLabel: string;

  let handleDialClick: (event: MouseEvent<HTMLButtonElement>) => void;

  if (isExpanded) {
    dialLabel = t('hideActionsLabel');

    handleDialClick = event => {
      event.currentTarget.blur();
      setIsExpanded(false);
    };
  } else if (timer.isPaused) {
    dialLabel = t('resumeTimerLabel');

    handleDialClick = event => {
      event.currentTarget.blur();
      startTimer();
    };
  } else if (timer.isActive) {
    dialLabel = t('showActionsLabel');

    handleDialClick = () => {
      setIsExpanded(true);
    };
  } else {
    dialLabel = t('startTimerLabel');

    handleDialClick = event => {
      event.currentTarget.blur();
      startTimer();
    };
  }

  const handleActionClick = (callback: DialActionClickHandler) => {
    return (event: MouseEvent<HTMLButtonElement>) => {
      event.currentTarget.blur();
      setIsExpanded(false);
      callback();
    };
  };

  const handleOverlayClick = () => {
    setIsExpanded(false);
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

  return (
    <>
      <div
        className={cc({
          [styles.container]: true,
          [styles.isExpanded]: isExpanded,
        })}
        data-testid="dial"
      >
        <button
          aria-label={dialLabel}
          className={cc({
            [styles.dial]: true,
            [styles.isActive]: timer.isActive,
            [styles.isHoverable]: isHoverable,
          })}
          onClick={handleDialClick}
        >
          <div aria-hidden={timer.isActive} className={styles.panel}>
            {t('startTimer')}
          </div>
          <div
            aria-hidden={!timer.isActive}
            className={cc({
              [styles.panel]: true,
              [styles.isPaused]: timer.isPaused,
            })}
          >
            <Counter time={timer.time} />
          </div>
          {timer.isPaused && <div className={styles.panel}>{t('resumeTimer')}</div>}
          <div aria-hidden={!timer.isActive} className={styles.panel}>
            <MoreIcon width={18} />
          </div>
        </button>
        <div className={styles.actions}>
          {dialActions.map(action => (
            <button
              aria-hidden={!isExpanded}
              aria-label={action.label}
              className={styles.action}
              key={action.id}
              onClick={handleActionClick(action.onClick)}
              tabIndex={isExpanded ? 0 : -1}
              title={action.title}
            >
              {action.Content}
            </button>
          ))}
        </div>
      </div>
      <div
        className={cc({
          [styles.overlay]: true,
          [styles.isVisible]: isExpanded,
        })}
        data-testid="dial-overlay"
        onClick={handleOverlayClick}
        role="presentation"
      />
    </>
  );
};

export default DialContent;
