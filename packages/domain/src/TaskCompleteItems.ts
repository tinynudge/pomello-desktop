import { RemoveTask } from './RemoveTask';
import { SelectItem } from './SelectItem';

export type TaskCompleteItems = {
  items?: SelectItem[];
  moveTaskItemId?: string;
  removeTask?: RemoveTask;
};
