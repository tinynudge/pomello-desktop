import { SelectItem } from './SelectItem';

export type TaskCompleteItems = {
  items?: SelectItem[];
  moveTaskItemId?: string;
  shouldRemoveTaskFromCache?: boolean;
};
