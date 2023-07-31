import type { SelectItem } from '@domain';

const filterItems = (items: SelectItem[], query: string) => {
  if (!query) {
    return items;
  }

  const queryRegex = new RegExp(
    query
      .split('')
      .map(char => char.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&'))
      .join('(?:.*)'),
    'i'
  );

  const filter = (items: SelectItem[]) => {
    const filteredItems: SelectItem[] = [];

    items.forEach(item => {
      if (item.type === 'group' || item.type === 'customGroup') {
        const results = filter(item.items);

        if (results.length) {
          filteredItems.push({ ...item, items: results });
        }
      } else if (queryRegex.test(item.label)) {
        filteredItems.push(item);
      }
    });

    return filteredItems;
  };

  return filter(items);
};

export default filterItems;
