import { PomelloEvent } from '@tinynudge/pomello-service';
import findOrFailTask from '../helpers/findOrFailTask';
import isCheckItem from '../helpers/isCheckItem';
import { TrelloRuntime } from '../TrelloRuntime';

const onTaskStart = (runtime: TrelloRuntime, event: PomelloEvent): void => {
  const { cache, translate } = runtime;
  const { log, preferences } = cache.get();

  if (preferences.keepLogs && log && event.taskId) {
    const task = findOrFailTask(cache, event.taskId);
    const entry = isCheckItem(task) ? 'commentLogCheckItemStart' : 'commentLogTaskStart';

    log.addEntry(translate(entry)).save();
  }
};

export default onTaskStart;
