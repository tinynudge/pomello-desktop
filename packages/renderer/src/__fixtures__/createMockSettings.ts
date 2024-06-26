import { Settings } from '@pomello-desktop/domain';

const defaultSettings: Settings = {
  alwaysOnTop: true,
  snapEdges: true,
  timeExpiredNotification: 'flash',
  overtime: true,
  overtimeDelay: 300,
  checkPomelloStatus: true,
  warnBeforeTaskCancel: true,
  warnBeforeAppQuit: true,
  taskTime: 1500,
  shortBreakTime: 300,
  longBreakTime: 900,
  pomodoroSet: 4,
  resetPomodoroSet: true,
  autoStartTasks: false,
  autoStartBreaks: false,
  titleMarker: '🍅',
  titleFormat: 'decimal',
  completedTaskPosition: 'top',
  createdTaskPosition: 'top',
  productivityChartType: 'bar',
  productivityChartDays: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
  betweenTasksGracePeriod: 8,
  longBreakTimerEndSound: 'ding',
  longBreakTimerEndVol: '1',
  longBreakTimerStartSound: 'wind-up',
  longBreakTimerStartVol: '1',
  longBreakTimerTickSound: 'egg-timer',
  longBreakTimerTickVol: '1',
  osxAllowMoveAnywhere: false,
  selectMaxRows: 10,
  shortBreakTimerEndSound: 'ding',
  shortBreakTimerEndVol: '1',
  shortBreakTimerStartSound: 'wind-up',
  shortBreakTimerStartVol: '1',
  shortBreakTimerTickSound: 'egg-timer',
  shortBreakTimerTickVol: '1',
  showAddNoteButton: true,
  showMenuButton: true,
  showPauseButton: true,
  showSwitchTaskButton: true,
  showTaskFinishedButton: true,
  showVoidTaskButton: true,
  taskTimerEndSound: 'ding',
  taskTimerEndVol: '1',
  taskTimerStartSound: 'wind-up',
  taskTimerStartVol: '1',
  taskTimerTickSound: 'egg-timer',
  taskTimerTickVol: '1',
  sounds: {},
};

export const createMockSettings = (settings: Partial<Settings> = {}): Settings => {
  return {
    ...defaultSettings,
    ...settings,
  };
};
