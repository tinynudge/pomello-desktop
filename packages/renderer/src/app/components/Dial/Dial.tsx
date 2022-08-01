import cc from 'classcat';
import { FC, MouseEvent, useState } from 'react';
import styles from './Dial.module.scss';
import Transition from './Transition';

const Dial: FC = () => {
  const [timerState, setTimerState] = useState('idle');
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHoverable, setIsHoverable] = useState(false);

  const handleStartClick = (event: MouseEvent<HTMLButtonElement>) => {
    if (isExpanded) {
      event.currentTarget.blur();

      setIsExpanded(false);
    } else if (timerState === 'active') {
      setIsExpanded(true);
    } else if (timerState === 'paused') {
      event.currentTarget.blur();

      setTimerState('active');

      setHoverTimeout();
    } else if (timerState === 'idle') {
      event.currentTarget.blur();

      setTimerState('active');

      setHoverTimeout();
    }
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
          className={cc({
            [styles.dial]: true,
            [styles.isActive]: timerState !== 'idle',
            [styles.isHoverable]: isHoverable,
          })}
          onClick={handleStartClick}
        >
          <div className={styles.panel}>Start</div>
          <div
            className={cc({
              [styles.panel]: true,
              [styles.isPaused]: timerState === 'paused',
            })}
          >
            time
          </div>
          {timerState === 'paused' && <div className={styles.panel}>Start</div>}
          <div className={styles.panel}>...</div>
        </button>
        <button
          className={styles.action}
          tabIndex={isExpanded ? 0 : -1}
          onClick={() => {
            setIsExpanded(false);
            setTimerState('paused');
          }}
        >
          1
        </button>
        <button className={styles.action} tabIndex={isExpanded ? 0 : -1}>
          2
        </button>
        <button className={styles.action} tabIndex={isExpanded ? 0 : -1}>
          3
        </button>
      </div>
      {/* use onAnimationEnd to show/hide? */}
      <Transition isVisible={isExpanded}>
        {(state, onTransitionEnd) => {
          console.log(state, styles.isVisible);

          return (
            <div
              className={cc({
                [styles.overlay]: true,
                [styles.isVisible]: state === 'entering' || state === 'entered',
              })}
              onTransitionEnd={onTransitionEnd}
            >
              {state}
            </div>
          );
        }}
      </Transition>
    </>
  );
};

export default Dial;
