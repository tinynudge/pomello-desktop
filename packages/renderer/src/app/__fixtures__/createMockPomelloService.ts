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

export const createMockPomelloService = (settings: Settings): PomelloService => {
  const pomelloService = createPomelloService({
    createTicker,
    settings: {
      ...defaultSettings,
      ...getPomelloSettings(settings),
    },
  });

  window.app.onSettingsChange(updatedSettings => {
    pomelloService.updateSettings(getPomelloSettings(updatedSettings));
  });

  return pomelloService;
};
