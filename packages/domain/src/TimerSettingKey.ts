import { TimerPhase } from './TimerPhase';
import { TimerType } from './TimerType';

export type TimerSettingKey = `${keyof typeof TimerType}Timer${Capitalize<TimerPhase>}`;
