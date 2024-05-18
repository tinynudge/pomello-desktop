import { TaskTimerEndPromptHandledAction } from '@tinynudge/pomello-service';

export type TaskTimerEndPromptHandledResponse = {
  action?: TaskTimerEndPromptHandledAction;
  shouldRemoveTaskFromCache?: boolean;
} | void;
