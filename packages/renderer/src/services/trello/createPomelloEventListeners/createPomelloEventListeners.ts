import { PomelloEventListeners, PomelloEventType } from '@pomello-desktop/domain';
import { TrelloRuntime } from '../domain';
import { onTaskEnd } from './onTaskEnd';
import { onTaskStart } from './onTaskStart';
import { onTaskVoid } from './onTaskVoid';
import { onTimerPause } from './onTimerPause';
import { onTimerResume } from './onTimerResume';

export const createPomelloEventListeners = (runtime: TrelloRuntime): PomelloEventListeners => ({
  [PomelloEventType.TaskStart]: onTaskStart.bind(null, runtime),
  [PomelloEventType.TaskEnd]: onTaskEnd.bind(null, runtime),
  [PomelloEventType.TaskVoid]: onTaskVoid.bind(null, runtime),
  [PomelloEventType.TimerPause]: onTimerPause.bind(null, runtime),
  [PomelloEventType.TimerResume]: onTimerResume.bind(null, runtime),
});
