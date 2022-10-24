import { PomelloEventType } from '@domain';
import { PomelloEvent } from '@tinynudge/pomello-service';
import findOrFailTask from './helpers/findOrFailTask';
import isCheckItem from './helpers/isCheckItem';
import { TrelloRuntime } from './TrelloRuntime';

const onPomelloEvent = (
  { cache, translate }: TrelloRuntime,
  type: PomelloEventType,
  event: PomelloEvent
) => {
  const { log, preferences } = cache.get();

  if (!preferences.keepLogs || !log || !event.taskId) {
    return;
  }

  const task = findOrFailTask(cache, event.taskId);

  if (type === PomelloEventType.TaskStart) {
    const entry = isCheckItem(task) ? 'commentLogCheckItemStart' : 'commentLogTaskStart';

    log.addEntry(translate(entry)).save();
  } else if (type === PomelloEventType.TimerPause) {
    const entry = isCheckItem(task) ? 'commentLogCheckItemPause' : 'commentLogTaskPause';

    log.addEntry(translate(entry)).save();
  } else if (type === PomelloEventType.TimerResume) {
    const entry = isCheckItem(task) ? 'commentLogCheckItemResume' : 'commentLogTaskResume';

    log.addEntry(translate(entry)).save();
  } else if (type === PomelloEventType.TaskEnd && event.timer) {
    const time = event.timer.totalTime - event.timer.time;
    const entry = isCheckItem(task) ? 'commentLogCheckItemStop' : 'commentLogTaskStop';

    log.addEntry(translate(entry)).updateTimeSpent(time).save();
  } else if (type === PomelloEventType.TaskVoid && event.timer) {
    const entry = isCheckItem(task) ? 'commentLogCheckItemVoid' : 'commentLogTaskVoid';

    if (event.timer.totalTime === event.timer.time) {
      log.removeLastEntry().updateTimeSpent(event.timer.totalTime * -1);
    }

    log.addEntry(translate(entry)).save();
  }
};

export default onPomelloEvent;
