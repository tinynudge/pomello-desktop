import { Settings } from '@domain';
import createPomelloService, {
  PomelloService,
  PomelloSettings,
  Ticker,
} from '@tinynudge/pomello-service';

const defaultSettings: PomelloSettings = {
  betweenTasksGracePeriod: 0,
  longBreakTime: 10,
  overtimeDelay: 5,
  set: ['task', 'shortBreak', 'task', 'shortBreak', 'task', 'shortBreak', 'task', 'longBreak'],
  shortBreakTime: 5,
  taskTime: 30,
};

const createTicker = (): Ticker => {
  let tickId: NodeJS.Timeout | undefined;
  let waitId: NodeJS.Timeout | undefined;

  return {
    start(tick) {
      tickId = setInterval(tick, 1000);
    },
    stop() {
      if (tickId) {
        clearInterval(tickId);
      }
    },
    wait(callback, delay) {
      waitId = setTimeout(callback, delay * 1000);

      return () => {
        if (waitId) {
          clearTimeout(waitId);
        }
      };
    },
  };
};

const createMockPomelloService = (settings: Settings): PomelloService => {
  return createPomelloService({
    createTicker,
    settings: { ...defaultSettings, ...settings },
  });
};

export default createMockPomelloService;
