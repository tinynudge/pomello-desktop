import { TimerPhase, TimerSettingKey, TimerType } from '@pomello-desktop/domain';

const timerTypeMap: Record<TimerType, keyof typeof TimerType> = {
  [TimerType.longBreak]: 'longBreak',
  [TimerType.shortBreak]: 'shortBreak',
  [TimerType.task]: 'task',
};

export const getTimerSettingKey = (type: TimerType, phase: TimerPhase): TimerSettingKey =>
  `${timerTypeMap[type]}Timer${phase.charAt(0).toUpperCase()}${phase.slice(1)}` as TimerSettingKey;
