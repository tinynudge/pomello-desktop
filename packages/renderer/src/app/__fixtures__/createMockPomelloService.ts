import { Settings } from '@domain';
import createPomelloService, { PomelloService, PomelloSettings } from '@tinynudge/pomello-service';
import { createTicker } from './mockPomelloServiceTicker';

const defaultSettings: PomelloSettings = {
  betweenTasksGracePeriod: 0,
  longBreakTime: 10,
  overtimeDelay: 5,
  set: ['task', 'shortBreak', 'task', 'shortBreak', 'task', 'shortBreak', 'task', 'longBreak'],
  shortBreakTime: 5,
  taskTime: 30,
};

const createMockPomelloService = (settings: Settings): PomelloService => {
  return createPomelloService({
    createTicker,
    settings: { ...defaultSettings, ...settings },
  });
};

export default createMockPomelloService;
