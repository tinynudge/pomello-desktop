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

  // Each start() mints a fresh empty object as a unique identity token for
  // that loop. Uniqueness is guaranteed by object reference.
  let activeToken: object | null = null;

  const stop: TickerStop = () => {
    activeToken = null;

    if (tickId) {
      window.clearTimeout(tickId);

      tickId = null;
    }
  };

  const start: TickerStart = tick => {
    // Cancel any existing loop
    stop();

    // Mint a fresh token for this loop. The step closure captures it by
    // reference; activeToken is updated to point at the same object.
    const token = {};
    activeToken = token;

    let expected = Date.now() + interval;

    const step = () => {
      // If activeToken no longer points at our token, either stop() was called
      // or a newer start() has run. Either way this loop is stale — exit
      // without ticking or rescheduling so it cannot double-count.
      if (activeToken !== token) {
        return;
      }

      const drift = Date.now() - expected;
      const newTimeout = Math.max(0, interval - drift);

      expected += interval;

      tick();

      // tick() may have called stop() (e.g. the countdown reached zero), which
      // would have nulled activeToken. Only reschedule if we are still active.
      if (activeToken === token) {
        tickId = window.setTimeout(step, newTimeout);
      }
    };

    tickId = window.setTimeout(step, interval);
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
