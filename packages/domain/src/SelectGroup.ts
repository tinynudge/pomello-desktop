import { SelectItem } from './SelectItem';
import { SelectItemBase } from './SelectItemBase';

export type SelectGroup = SelectItemBase & {
  items: SelectItem[];
  type: 'group';
};
