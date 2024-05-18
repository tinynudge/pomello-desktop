import { SelectItem } from '@pomello-desktop/domain';
import { Accessor, createMemo } from 'solid-js';

export const useFilterItems = (
  getQuery: Accessor<string>,
  getUnfilteredItems: Accessor<SelectItem[]>
) => {
  const filteredItems = createMemo(() => {
    const query = getQuery();

    if (!query) {
      return getUnfilteredItems();
    }

    const queryRegex = new RegExp(
      query
        .split('')
        .map(char => char.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&'))
        .join('(?:.*)'),
      'i'
    );

    const filterItems = (items: SelectItem[]) => {
      const filteredItems: SelectItem[] = [];

      items.forEach(item => {
        if (item.type === 'group' || item.type === 'customGroup') {
          const results = filterItems(item.items);

          if (results.length) {
            filteredItems.push({ ...item, items: results });
          }
        } else if (queryRegex.test(item.label)) {
          filteredItems.push(item);
        }
      });

      return filteredItems;
    };

    return filterItems(getUnfilteredItems());
  });

  return filteredItems;
};
