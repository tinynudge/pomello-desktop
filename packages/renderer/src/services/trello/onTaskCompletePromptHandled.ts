import findOrFailTask from './helpers/findOrFailTask';
import isCheckItem from './helpers/isCheckItem';
import moveCardAndUpdateDoneList from './helpers/moveCardAndUpdateDoneList';
import { TrelloRuntime } from './TrelloRuntime';

const onTaskCompletePromptHandled = (
  runtime: TrelloRuntime,
  taskId: string,
  optionId: string
): void => {
  const task = findOrFailTask(runtime.cache, taskId);

  if (!isCheckItem(task)) {
    moveCardAndUpdateDoneList(runtime, task, optionId);
  }
};

export default onTaskCompletePromptHandled;
