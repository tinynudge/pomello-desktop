import { RemoveTask } from './RemoveTask';
import { SelectItem } from './SelectItem';

export type TaskCompleteItems = {
  completeTaskId?: string;
  items?: SelectItem[];
  moveTaskItemId?: string;
  removeTask?: RemoveTask;
};
