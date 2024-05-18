import { PomelloEvent } from '@tinynudge/pomello-service';
import { TrelloRuntime } from '../domain';
import { findOrFailTask } from '../helpers/findOrFailTask';
import { isCheckItem } from '../helpers/isCheckItem';

export const onTaskStart = ({ cache, translate }: TrelloRuntime, event: PomelloEvent): void => {
  const log = cache.store.log;
  const preferences = cache.store.preferences;

  if (preferences.keepLogs && log && event.taskId) {
    const task = findOrFailTask(cache, event.taskId);
    const entry = isCheckItem(task) ? 'commentLogCheckItemStart' : 'commentLogTaskStart';

    log.addEntry(translate(entry)).save();
  }
};
