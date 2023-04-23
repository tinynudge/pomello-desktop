import { SelectItem } from './SelectItem';

export type GetTaskCompleteItemsResponse =
  | SelectItem[]
  | {
      items?: SelectItem[];
      moveTaskItemId?: string;
      shouldRemoveTaskFromCache?: boolean;
    }
  | void;
