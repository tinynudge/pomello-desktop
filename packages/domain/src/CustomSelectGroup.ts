import { SelectItem } from './SelectItem';
import { SelectItemBase } from './SelectItemBase';

export type CustomSelectGroup = SelectItemBase & {
  items: SelectItem[];
  type: 'customGroup';
};
