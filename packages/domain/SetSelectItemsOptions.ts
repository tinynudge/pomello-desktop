import { SelectItem } from './SelectItem';

export interface SetSelectItemsOptions {
  items: SelectItem[];
  noResultsMessage?: string;
  placeholder?: string;
}
