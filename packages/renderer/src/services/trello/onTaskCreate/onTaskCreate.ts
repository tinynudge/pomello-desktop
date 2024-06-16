import { OnTaskCreateResponse } from '@pomello-desktop/domain';
import { createCard } from '../api/createCard';
import { TrelloRuntime } from '../domain';
import { findLabelIds } from './findLabelIds';
import { findTargetList } from './findTargetList';
import { parseCreateTaskInput } from './parseCreateTaskInput';

export const onTaskCreate = (runtime: TrelloRuntime, input: string): OnTaskCreateResponse => {
  const { cache, config, logger, translate } = runtime;

  const params = parseCreateTaskInput(input);

  if (!params.title) {
    return {
      notification: [translate('createTaskTitleRequired')],
    };
  }

  const list = findTargetList(runtime, params.list);

  if (!list) {
    return;
  }

  return {
    createTask: async () => {
      const { labelIds, unknownLabels } = await findLabelIds(list, params.labels);

      logger.debug('Will create Trello card');

      await createCard({
        description: params.desc,
        labelIds,
        listId: list.id,
        position: config.store.createdTaskPosition ?? 'top',
        title: params.title,
      });

      logger.debug('Did create Trello card');

      const message = unknownLabels.length
        ? translate('createTaskSuccessWithoutLabelsMessage', { labels: unknownLabels.join(', ') })
        : translate('createTaskSuccessMessage');

      return {
        notification: [translate('createTaskSuccessHeading'), message],
        shouldInvalidateTasksCache: list.id === cache.store.currentList.id,
      };
    },
  };
};
