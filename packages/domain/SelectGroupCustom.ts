import type { SelectItem } from './SelectItem';
import type { SelectItemBase } from './SelectItemBase';

export interface SelectGroupDefault extends SelectItemBase {
  type: 'group';
  items: SelectItem[];
}
