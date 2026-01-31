import { RemoveTask } from './RemoveTask';
import { SelectItem } from './SelectItem';

export type TaskCompleteItems = {
  completeTaskItemId?: string;
  items?: SelectItem[];
  moveTaskItemId?: string;
  removeTask?: RemoveTask;
};
