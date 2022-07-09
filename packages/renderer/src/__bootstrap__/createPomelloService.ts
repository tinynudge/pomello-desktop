import baseCreatePomelloService, {
  PomelloService,
  Ticker,
  TickerStart,
  TickerStop,
  TickerWait,
} from '@tinynudge/pomello-service';

const createTicker = (): Ticker => {
  const interval = 1000;

  let tickId: number | null = null;
  let waitId: number | null = null;

  const start: TickerStart = tick => {
    let expected = Date.now() + interval;

    const step = () => {
      const drift = Date.now() - expected;
      const newTimeout = Math.max(0, interval - drift);

      expected += interval;

      tick();

      if (tickId) {
        tickId = window.setTimeout(step, newTimeout);
      }
    };

    tickId = window.setTimeout(step, interval);
  };

  const stop: TickerStop = () => {
    if (tickId) {
      window.clearTimeout(tickId);

      tickId = null;
    }
  };

  const wait: TickerWait = (callback, delay) => {
    waitId = window.setTimeout(callback, delay * interval);

    return () => {
      if (waitId) {
        clearTimeout(waitId);
      }
    };
  };

  return { start, stop, wait };
};

const createPomelloService = async (): Promise<PomelloService> => {
  const { betweenTasksGracePeriod, longBreakTime, overtimeDelay, shortBreakTime, taskTime } =
    await window.app.getSettings();

  return baseCreatePomelloService({
    createTicker,
    settings: {
      betweenTasksGracePeriod,
      longBreakTime,
      overtimeDelay,
      set: ['task', 'shortBreak', 'task', 'longBreak'],
      shortBreakTime,
      taskTime,
    },
  });
};

export default createPomelloService;
