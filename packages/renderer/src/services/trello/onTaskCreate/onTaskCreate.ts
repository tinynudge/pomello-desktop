import createCard from '../api/createCard';
import { TrelloRuntime } from '../TrelloRuntime';
import findLabelIds from './findLabelIds';
import findTargetList from './findTargetList';
import parseCreateTaskInput from './parseCreateTaskInput';

const onTaskCreate = (runtime: TrelloRuntime, input: string): false | void => {
  const { config, translate } = runtime;

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
    await createCard({
      description: params.desc,
      labelIds,
      listId: list.id,
      position: config.get().createdTaskPosition ?? 'top',
      title: params.title,
    });

    const message = unknownLabels.length
      ? translate('createTaskSuccessWithoutLabelsMessage', { labels: unknownLabels.join(', ') })
      : translate('createTaskSuccessMessage');

    new Notification(translate('createTaskSuccessHeading'), { body: message });
  });
};

export default onTaskCreate;
