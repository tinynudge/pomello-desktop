import { Settings } from '@pomello-desktop/domain';
import {
  createPomelloService as baseCreatePomelloService,
  PomelloService,
  PomelloSettings,
  SetItem,
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

const getPomelloSettings = ({
  betweenTasksGracePeriod,
  longBreakTime,
  overtimeDelay,
  pomodoroSet,
  shortBreakTime,
  taskTime,
}: Settings): PomelloSettings => {
  const set = Array.isArray(pomodoroSet)
    ? pomodoroSet
    : [...Array(pomodoroSet - 1)]
        .flatMap<SetItem>(() => ['task', 'shortBreak'])
        .concat(['task', 'longBreak']);

  return {
    betweenTasksGracePeriod,
    longBreakTime,
    overtimeDelay,
    set,
    shortBreakTime,
    taskTime,
  };
};

export const createPomelloService = (settings: Settings): PomelloService => {
  const pomelloService = baseCreatePomelloService({
    createTicker,
    settings: getPomelloSettings(settings),
  });

  window.app.onSettingsChange(updatedSettings => {
    const pomelloSettings = getPomelloSettings(updatedSettings);

    pomelloService.updateSettings(pomelloSettings);
  });

  return pomelloService;
};
