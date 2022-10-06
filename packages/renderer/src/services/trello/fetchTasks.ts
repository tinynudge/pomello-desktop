import assertNonNullish from '@/shared/helpers/assertNonNullish';
import { Cache, SelectItem, ServiceConfig } from '@domain';
import fetchCardsByListId from './api/fetchCardsByListId';
import { TrelloCache, TrelloCard, TrelloCheckItem, TrelloConfig } from './domain';

const fetchTasks = async (
  cache: Cache<TrelloCache>,
  config: ServiceConfig<TrelloConfig>
): Promise<SelectItem[]> => {
  const { currentList } = config.get();

  assertNonNullish(currentList, 'Unable to get current list');

  const cards = await fetchCardsByListId(currentList);

  const tasksById = new Map<string, TrelloCard | TrelloCheckItem>();

  const tasks = cards
    .sort((cardA, cardB) => cardA.pos - cardB.pos)
    .flatMap(card => {
      tasksById.set(card.id, card);

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

          const checklistItems: SelectItem[] = [];

          checkItems.forEach(checkItem => {
            tasksById.set(checkItem.id, { ...checkItem, idCard: card.id });

            checklistItems.push({
              id: checkItem.id,
              label: checkItem.name,
            });
          });

          checklists.push({
            id: checklist.id,
            label: checklist.name,
            items: checklistItems,
            type: 'group',
          });
        });

      if (checklists.length) {
        items.push(...checklists);
      }

      return items;
    });

  cache.set(draft => {
    draft.tasks = tasksById;
  });

  return tasks;
};

export default fetchTasks;
