import type { SelectItem } from './SelectItem';
import type { SelectItemBase } from './SelectItemBase';

export interface SelectGroup extends SelectItemBase {
  items: SelectItem[];
  type: 'group';
}
