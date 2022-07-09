import { SelectItem } from './SelectItem';
import { SelectItemBase } from './SelectItemBase';

export interface SelectGroupDefault extends SelectItemBase {
  type: 'group';
  items: SelectItem[];
}
