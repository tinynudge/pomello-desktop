import { TaskTimerEndPromptHandledEvent, TaskTimerEndPromptHandledResponse } from '@domain';
import { TrelloRuntime } from './TrelloRuntime';
import completeCheckItem from './helpers/completeCheckItem';
import findOrFailTask from './helpers/findOrFailTask';
import isCheckItem from './helpers/isCheckItem';
import moveCardAndUpdateDoneList from './helpers/moveCardAndUpdateDoneList';

const onTaskTimerEndPromptHandled = (
  runtime: TrelloRuntime,
  { optionId, taskId }: TaskTimerEndPromptHandledEvent
): TaskTimerEndPromptHandledResponse => {
  const task = findOrFailTask(runtime.cache, taskId);

  if (isCheckItem(task)) {
    completeCheckItem(runtime, task);
  } else {
    moveCardAndUpdateDoneList(runtime, task, optionId);
  }

  return {
    action: 'switchTask',
  };
};

export default onTaskTimerEndPromptHandled;
