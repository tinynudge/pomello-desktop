import useDialActions from '@/app/hooks/useDialActions';
import usePomelloActions from '@/app/hooks/usePomelloActions';
import useTranslation from '@/shared/hooks/useTranslation';
import { DialActionClickHandler } from '@domain';
import { Timer } from '@tinynudge/pomello-service';
import cc from 'classcat';
import { FC, MouseEvent, useState } from 'react';
import { ReactComponent as MoreIcon } from './assets/more.svg';
import Counter from './Counter';
import styles from './Dial.module.scss';

interface DialProps {
  timer: Timer;
}

const Dial: FC<DialProps> = ({ timer }) => {
  const { t } = useTranslation();

  const { dialActions } = useDialActions();
  const { startTimer } = usePomelloActions();

  const [isExpanded, setIsExpanded] = useState(false);
  const [isHoverable, setIsHoverable] = useState(false);

  let dialLabel: string;

  let handleDialClick: (event: MouseEvent<HTMLButtonElement>) => void;

  if (isExpanded) {
    dialLabel = t('hideActionsLabel');

    handleDialClick = event => {
      event.currentTarget.blur();
      setIsExpanded(false);
    };
  } else if (timer.isActive) {
    dialLabel = t('showActionsLabel');

    handleDialClick = () => {
      setIsExpanded(true);
    };
  } else if (timer.isPaused) {
    dialLabel = t('resumeTimerLabel');

    handleDialClick = event => {
      event.currentTarget.blur();
      startTimer();
      setHoverTimeout();
    };
  } else {
    dialLabel = t('startTimerLabel');

    handleDialClick = event => {
      event.currentTarget.blur();
      startTimer();
      setHoverTimeout();
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
    setIsHoverable(false);

    setTimeout(() => {
      setIsHoverable(true);
    }, 750);
  };

  return (
    <>
      <div
        className={cc({
          [styles.container]: true,
          [styles.isExpanded]: isExpanded,
        })}
      >
        <button
          aria-label={dialLabel}
          className={cc({
            [styles.dial]: true,
            [styles.isActive]: timer.isActive || timer.isPaused,
            [styles.isHoverable]: isHoverable,
          })}
          onClick={handleDialClick}
        >
          <div aria-hidden={timer.isActive || timer.isPaused} className={styles.panel}>
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

export default Dial;
