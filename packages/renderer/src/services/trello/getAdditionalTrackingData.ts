import { AdditionalTrackingData } from '@domain';
import { PomelloEvent } from '@tinynudge/pomello-service';
import { TrelloRuntime } from './TrelloRuntime';
import findOrFailTask from './helpers/findOrFailTask';
import isCheckItem from './helpers/isCheckItem';

const getAdditionalTrackingData = (
  { cache }: TrelloRuntime,
  event: PomelloEvent
): AdditionalTrackingData | void => {
  if (!event.taskId) {
    return;
  }

  const currentTask = findOrFailTask(cache, event.taskId);

  if (isCheckItem(currentTask)) {
    return {
      parent_service_id: currentTask.idCard,
    };
  }
};

export default getAdditionalTrackingData;
