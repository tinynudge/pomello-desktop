import { PomelloEvent } from '@tinynudge/pomello-service';
import findOrFailTask from '../helpers/findOrFailTask';
import isCheckItem from '../helpers/isCheckItem';
import { TrelloRuntime } from '../TrelloRuntime';

const onTimerPause = (runtime: TrelloRuntime, event: PomelloEvent): void => {
  const { cache, translate } = runtime;
  const { log, preferences } = cache.get();

  if (preferences.keepLogs && log && event.taskId) {
    const task = findOrFailTask(cache, event.taskId);
    const entry = isCheckItem(task) ? 'commentLogCheckItemPause' : 'commentLogTaskPause';

    log.addEntry(translate(entry)).save();
  }
};

export default onTimerPause;
