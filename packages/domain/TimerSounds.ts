import { Sound } from './Sound';
import { TimerPhase } from './TimerPhase';
import { TimerType } from './TimerType';

export type TimerSounds = Record<TimerType, Record<TimerPhase, Sound | null>>;
