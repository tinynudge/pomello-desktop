import { SelectItem } from './SelectItem';

export type TaskCompleteItems =
  | SelectItem[]
  | {
      items: SelectItem[];
      moveTaskItemId?: string;
    }
  | void;
