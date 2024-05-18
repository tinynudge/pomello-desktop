import { PomelloEvent } from '@tinynudge/pomello-service';
import { TrelloRuntime } from '../domain';
import { findOrFailTask } from '../helpers/findOrFailTask';
import { isCheckItem } from '../helpers/isCheckItem';

export const onTaskVoid = ({ cache, translate }: TrelloRuntime, event: PomelloEvent): void => {
  const log = cache.store.log;
  const preferences = cache.store.preferences;

  if (preferences.keepLogs && log && event.taskId && event.timer) {
    const task = findOrFailTask(cache, event.taskId);
    const entry = isCheckItem(task) ? 'commentLogCheckItemVoid' : 'commentLogTaskVoid';

    if (event.timer.adjustedTotalTime === event.timer.time) {
      log.removeLastEntry().updateTimeSpent(event.timer.adjustedTotalTime * -1);
    }

    log.addEntry(translate(entry)).save();
  }
};
