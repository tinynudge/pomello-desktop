import { createCard } from '../api/createCard';
import { TrelloRuntime } from '../domain';
import { findLabelIds } from './findLabelIds';
import { findTargetList } from './findTargetList';
import { parseCreateTaskInput } from './parseCreateTaskInput';

export const onTaskCreate = (runtime: TrelloRuntime, input: string): false | void => {
  const { config, logger, translate } = runtime;

  const params = parseCreateTaskInput(input);

  if (!params.title) {
    new Notification(translate('createTaskTitleRequired'));

    return false;
  }

  const list = findTargetList(runtime, params.list);

  if (!list) {
    return false;
  }

  findLabelIds(list, params.labels).then(async ({ labelIds, unknownLabels }) => {
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

    new Notification(translate('createTaskSuccessHeading'), { body: message });
  });
};
