import { TaskCompletePromptHandledEvent, TaskCompletePromptHandledResponse } from '@domain';
import { TrelloRuntime } from './TrelloRuntime';
import findOrFailTask from './helpers/findOrFailTask';
import isCheckItem from './helpers/isCheckItem';
import moveCardAndUpdateDoneList from './helpers/moveCardAndUpdateDoneList';

const onTaskCompletePromptHandled = (
  runtime: TrelloRuntime,
  { optionId, taskId }: TaskCompletePromptHandledEvent
): TaskCompletePromptHandledResponse => {
  const task = findOrFailTask(runtime.cache, taskId);
  const isCurrentList = runtime.cache.get().currentList.id === optionId;

  if (!isCheckItem(task) && !isCurrentList) {
    moveCardAndUpdateDoneList(runtime, task, optionId);
  }

  return {
    shouldRemoveTaskFromCache: !isCurrentList,
  };
};

export default onTaskCompletePromptHandled;
