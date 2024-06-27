import { Settings } from '@pomello-desktop/domain';
import {
  createPomelloService,
  PomelloService,
  PomelloSettings,
  SetItem,
} from '@tinynudge/pomello-service';
import { createTicker } from './mockPomelloServiceTicker';

const defaultSettings: PomelloSettings = {
  betweenTasksGracePeriod: 0,
  longBreakTime: 10,
  overtimeDelay: 5,
  set: ['task', 'shortBreak', 'task', 'shortBreak', 'task', 'shortBreak', 'task', 'longBreak'],
  shortBreakTime: 5,
  taskTime: 30,
};

export const createMockPomelloService = (settings: Settings): PomelloService => {
  const { pomodoroSet } = settings;

  const set = Array.isArray(pomodoroSet)
    ? pomodoroSet
    : [...Array(pomodoroSet - 1)]
        .flatMap<SetItem>(() => ['task', 'shortBreak'])
        .concat(['task', 'longBreak']);

  return createPomelloService({
    createTicker,
    settings: {
      ...defaultSettings,
      ...settings,
      set,
    },
  });
};
