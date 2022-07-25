import { SelectItem } from '@domain';
import { useMemo } from 'react';

const useFilterItems = (query: string, unfilteredItems: SelectItem[]) => {
  return useMemo(() => {
    if (!query) {
      return unfilteredItems;
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

    return filterItems(unfilteredItems);
  }, [query, unfilteredItems]);
};

export default useFilterItems;
