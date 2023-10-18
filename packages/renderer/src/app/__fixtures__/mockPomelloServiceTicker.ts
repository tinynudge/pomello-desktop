import { Ticker } from '@tinynudge/pomello-service';

type TimerCallback = {
  callback: () => void;
  count: number;
  once: boolean;
};

const timers = new Map<number, TimerCallback>();
let count = 0;

export const createTicker = (): Ticker => {
  let id = 0;
  let tickId: number | undefined;
  let waitId: number | undefined;

  timers.clear();
  count = 0;

  return {
    start(tick) {
      id += 1;

      timers.set(id, {
        callback: tick,
        count: count + 1,
        once: false,
      });

      tickId = id;
    },
    stop() {
      if (tickId) {
        timers.delete(tickId);
      }
    },
    wait(callback, delay) {
      id += 1;

      timers.set(id, {
        callback,
        count: count + delay,
        once: true,
      });

      waitId = id;

      return () => {
        if (waitId) {
          timers.delete(waitId);
        }
      };
    },
  };
};

export const tickTimer = () => {
  count += 1;

  timers.forEach((timer, key) => {
    if (count >= timer.count) {
      timer.callback();

      if (timer.once) {
        timers.delete(key);
      }
    }
  });
};
