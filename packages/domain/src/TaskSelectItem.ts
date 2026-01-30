import { SelectItem } from './SelectItem';

/**
 * A TaskSelectItem is a SelectItem that can optionally have children SelectItems.
 *
 * This structure is useful for representing tasks that may have subtasks or related items.
 * A TaskSelectItem is different from a SelectGroup in that the TaskSelectItem itself is a
 * selectable item, whereas a SelectGroup is a non-selectable container for other items.
 *
 * @extends SelectItem
 * @property {SelectItem[]} [children] - Optional array of child SelectItems
 */
export type TaskSelectItem = SelectItem & { children?: SelectItem[] };
