import { SelectItem } from './SelectItem';
import { SelectItemBase } from './SelectItemBase';

export interface SelectGroup extends SelectItemBase {
  items: SelectItem[];
  type: 'group';
}
