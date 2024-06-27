import { GetTrackingEventServiceDataResponse } from '@pomello-desktop/domain';
import { TrelloRuntime } from './domain';
import { findOrFailTask } from './helpers/findOrFailTask';
import { isCheckItem } from './helpers/isCheckItem';

export const getTrackingEventServiceData = (
  { cache }: TrelloRuntime,
  currentTaskId: string
): GetTrackingEventServiceDataResponse => {
  if (!cache.store.preferences.trackStats) {
    return false;
  }

  const currentTask = findOrFailTask(cache, currentTaskId);

  if (isCheckItem(currentTask)) {
    return {
      parent_service_id: currentTask.idCard,
      service_id: currentTask.id,
    };
  }

  return {
    service_id: currentTask.id,
  };
};
