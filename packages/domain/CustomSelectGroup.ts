import type { SelectItem } from './SelectItem';
import type { SelectItemBase } from './SelectItemBase';

export interface CustomSelectGroup extends SelectItemBase {
  items: SelectItem[];
  type: 'customGroup';
}
