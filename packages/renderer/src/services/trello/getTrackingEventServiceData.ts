import { GetTrackingEventServiceDataResponse } from '@pomello-desktop/domain';
import { TrelloRuntime } from './domain';
import { findOrFailTask } from './helpers/findOrFailTask';
import { isCheckItem } from './helpers/isCheckItem';

export const getTrackingEventServiceData = (
  { cache }: TrelloRuntime,
  taskId: string
): GetTrackingEventServiceDataResponse => {
  if (!cache.store.preferences.trackStats) {
    return false;
  }

  const task = findOrFailTask(cache, taskId);

  if (isCheckItem(task)) {
    return {
      parent_service_id: task.idCard,
      service_id: task.id,
    };
  }

  return {
    service_id: task.id,
  };
};
