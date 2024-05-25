import { SelectItem } from './SelectItem';
import { SelectItemBase } from './SelectItemBase';

export type SelectGroupDefault = SelectItemBase & {
  type: 'group';
  items: SelectItem[];
};
