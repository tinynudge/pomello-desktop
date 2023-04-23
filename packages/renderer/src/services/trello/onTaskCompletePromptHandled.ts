import { TaskCompletePromptHandledEvent } from '@domain';
import { TrelloRuntime } from './TrelloRuntime';
import findOrFailTask from './helpers/findOrFailTask';
import isCheckItem from './helpers/isCheckItem';
import moveCardAndUpdateDoneList from './helpers/moveCardAndUpdateDoneList';

const onTaskCompletePromptHandled = (
  runtime: TrelloRuntime,
  { optionId, taskId }: TaskCompletePromptHandledEvent
): void => {
  const task = findOrFailTask(runtime.cache, taskId);

  if (!isCheckItem(task)) {
    moveCardAndUpdateDoneList(runtime, task, optionId);
  }
};

export default onTaskCompletePromptHandled;
