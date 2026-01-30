import { assertNonNullish } from '@/shared/helpers/assertNonNullish';
import { parseTaskName } from '@/shared/helpers/parseTaskName';
import { SelectItem, TaskSelectItem } from '@pomello-desktop/domain';
import { fetchCardsByListId } from './api/fetchCardsByListId';
import { TrelloCard, TrelloCheckItem, TrelloRuntime } from './domain';

export const fetchTasks = async ({
  cache,
  config,
  getUser,
  logger,
  settings,
  translate,
}: TrelloRuntime): Promise<SelectItem[]> => {
  const currentList = config.store.currentList;
  const user = getUser();

  assertNonNullish(currentList, 'Unable to get current list');

  logger.debug('Will fetch Trello cards');

  const cards = await fetchCardsByListId(currentList).catch(error => {
    logger.error('Failed to fetch Trello cards', error);

    throw error;
  });

  logger.debug('Did fetch Trello cards');

  const tasksById = new Map<string, TrelloCard | TrelloCheckItem>();

  const tasks = cards
    .sort((cardA, cardB) => cardA.pos - cardB.pos)
    .map<TaskSelectItem>(card => {
      tasksById.set(card.id, card);

      const task: TaskSelectItem = {
        id: card.id,
        label: parseTaskName(card.name, settings.titleMarker).name,
      };

      if (user?.type === 'premium') {
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
                label: parseTaskName(checkItem.name, settings.titleMarker).name,
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
          task.children = checklists;
        }
      }

      return task;
    });

  cache.actions.tasksSet(tasksById);

  tasks.push({
    id: 'switch-lists',
    label: translate('switchListsLabel'),
    type: 'customOption',
  });

  return tasks;
};
