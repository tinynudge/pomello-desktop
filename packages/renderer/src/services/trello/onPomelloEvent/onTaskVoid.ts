import { PomelloEvent } from '@tinynudge/pomello-service';
import findOrFailTask from '../helpers/findOrFailTask';
import isCheckItem from '../helpers/isCheckItem';
import { TrelloRuntime } from '../TrelloRuntime';

const onTaskVoid = (runtime: TrelloRuntime, event: PomelloEvent): void => {
  const { cache, translate } = runtime;
  const { log, preferences } = cache.get();

  if (preferences.keepLogs && log && event.taskId && event.timer) {
    const task = findOrFailTask(cache, event.taskId);
    const entry = isCheckItem(task) ? 'commentLogCheckItemVoid' : 'commentLogTaskVoid';

    if (event.timer.adjustedTotalTime === event.timer.time) {
      log.removeLastEntry().updateTimeSpent(event.timer.adjustedTotalTime * -1);
    }

    log.addEntry(translate(entry)).save();
  }
};

export default onTaskVoid;
