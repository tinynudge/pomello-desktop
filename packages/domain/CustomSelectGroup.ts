import { SelectItem } from './SelectItem';
import { SelectItemBase } from './SelectItemBase';

export interface CustomSelectGroup extends SelectItemBase {
  items: SelectItem[];
  type: 'customGroup';
}
