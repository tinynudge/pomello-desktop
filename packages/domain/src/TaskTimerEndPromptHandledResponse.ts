import { TaskTimerEndPromptHandledAction } from '@tinynudge/pomello-service';
import { RemoveTask } from './RemoveTask';

export type TaskTimerEndPromptHandledResponse = {
  action?: TaskTimerEndPromptHandledAction;
  removeTask?: RemoveTask;
};
