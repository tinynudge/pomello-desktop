import assertNonNullish from '@/shared/helpers/assertNonNullish';
import { SelectItem, ServiceConfig } from '@domain';
import { TrelloConfig } from './domain';
import fetchCardsByListId from './queries/fetchCardsByListId';

const fetchTasks = async (config: ServiceConfig<TrelloConfig>): Promise<SelectItem[]> => {
  const { currentList } = config.get();

  assertNonNullish(currentList, 'Unable to get current list');

  const cards = await fetchCardsByListId(currentList);

  return cards
    .sort((cardA, cardB) => cardA.pos - cardB.pos)
    .flatMap(card => {
      const items: SelectItem[] = [
        {
          id: card.id,
          label: card.name,
        },
      ];

      const checklists: SelectItem[] = [];
      card.checklists
        .sort((checklistA, checklistB) => checklistA.pos - checklistB.pos)
        .forEach(checklist => {
          const checkItems = checklist.checkItems
            .filter(checkItem => checkItem.state === 'incomplete')
            .sort((checkItemA, checkItemB) => checkItemA.pos - checkItemB.pos);

          if (!checkItems.length) {
            return;
          }

          checklists.push({
            id: checklist.id,
            label: checklist.name,
            items: checkItems.map(checkItem => ({
              id: checkItem.id,
              label: checkItem.name,
            })),
            type: 'group',
          });
        });

      if (checklists.length) {
        items.push(...checklists);
      }

      return items;
    });
};

export default fetchTasks;
