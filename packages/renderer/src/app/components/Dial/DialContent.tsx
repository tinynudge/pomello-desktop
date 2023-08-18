import { selectDialActions } from '@/app/appSlice';
import useHotkeys from '@/app/hooks/useHotkeys';
import usePomelloActions from '@/app/hooks/usePomelloActions';
import useTranslation from '@/shared/hooks/useTranslation';
import { DialAction } from '@domain';
import cc from 'classcat';
import { FC, MouseEvent, createElement, useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import AddNoteDialAction from './AddNoteDialAction';
import CompleteTaskDialAction from './CompleteTaskDialAction';
import Counter from './Counter';
import { DialActionProps } from './DialActionProps';
import styles from './DialContent.module.scss';
import PauseTimerDialAction from './PauseTimerDialAction';
import SkipTimerDialAction from './SkipTimerDialAction';
import SwitchTaskDialAction from './SwitchTaskDialAction';
import VoidTaskDialAction from './VoidTaskDialAction';
import { ReactComponent as MoreIcon } from './assets/more.svg';

interface DialContentProps {
  isActive: boolean;
  isPaused: boolean;
}

const DialActionsMap: Record<DialAction, FC<DialActionProps>> = {
  addNote: AddNoteDialAction,
  completeTask: CompleteTaskDialAction,
  pauseTimer: PauseTimerDialAction,
  skipTimer: SkipTimerDialAction,
  switchTask: SwitchTaskDialAction,
  voidTask: VoidTaskDialAction,
};

const DialContent: FC<DialContentProps> = ({ isActive, isPaused }) => {
  const { registerHotkeys } = useHotkeys();
  const { startTimer: startPomelloTimer } = usePomelloActions();
  const { t } = useTranslation();

  const dialActions = useSelector(selectDialActions);

  const [isExpanded, setIsExpanded] = useState(false);
  const [isHoverable, setIsHoverable] = useState(false);

  const startTimer = useCallback(() => {
    if (!isActive || isPaused) {
      startPomelloTimer();
    }
  }, [startPomelloTimer, isActive, isPaused]);

  useEffect(() => {
    if (isActive && !isPaused) {
      setHoverTimeout();
    } else if (!isActive) {
      setIsHoverable(false);
    }
  }, [isActive, isPaused]);

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
  } else if (isPaused) {
    dialLabel = t('resumeTimerLabel');

    handleDialClick = event => {
      event.currentTarget.blur();
      startTimer();
    };
  } else if (isActive) {
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

  const handleActionClick = () => {
    setIsExpanded(false);
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
            [styles.isActive]: isActive,
            [styles.isHoverable]: isHoverable,
          })}
          onClick={handleDialClick}
        >
          <div aria-hidden={isActive} className={styles.panel}>
            {t('startTimer')}
          </div>
          <div
            aria-hidden={!isActive}
            className={cc({
              [styles.panel]: true,
              [styles.isPaused]: isPaused,
            })}
          >
            <Counter />
          </div>
          {isPaused && <div className={styles.panel}>{t('resumeTimer')}</div>}
          <div aria-hidden={!isActive} className={styles.panel}>
            <MoreIcon width={18} />
          </div>
        </button>
        <div className={styles.actions}>
          {dialActions.map(action =>
            createElement(DialActionsMap[action], {
              className: styles.action,
              isVisible: isExpanded,
              key: action,
              onClick: handleActionClick,
            })
          )}
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
