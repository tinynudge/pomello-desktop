import { SelectItem } from './SelectItem';

export type TaskTimerEndItems =
  | SelectItem[]
  | {
      items: SelectItem[];
      moveTaskItemId?: string;
    };
