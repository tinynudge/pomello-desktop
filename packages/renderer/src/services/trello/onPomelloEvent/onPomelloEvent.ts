import { PomelloEventType } from '@domain';
import { PomelloEvent } from '@tinynudge/pomello-service';
import { TrelloRuntime } from '../TrelloRuntime';
import onTaskEnd from './onTaskEnd';
import onTaskStart from './onTaskStart';
import onTaskVoid from './onTaskVoid';
import onTimerPause from './onTimerPause';
import onTimerResume from './onTimerResume';

type PomelloEventHandler = (runtime: TrelloRuntime, event: PomelloEvent) => void;

const eventHandlers: Partial<Record<PomelloEventType, PomelloEventHandler>> = {
  [PomelloEventType.TaskEnd]: onTaskEnd,
  [PomelloEventType.TaskStart]: onTaskStart,
  [PomelloEventType.TaskVoid]: onTaskVoid,
  [PomelloEventType.TimerPause]: onTimerPause,
  [PomelloEventType.TimerResume]: onTimerResume,
};

const onPomelloEvent = (runtime: TrelloRuntime, type: PomelloEventType, event: PomelloEvent) => {
  eventHandlers[type]?.(runtime, event);
};

export default onPomelloEvent;
