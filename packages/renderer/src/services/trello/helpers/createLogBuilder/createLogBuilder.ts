import { format } from 'date-fns';
import addComment from '../../api/addComment';
import updateComment from '../../api/updateComment';
import { TrelloCard, TrelloLogBuilder } from '../../domain';
import { TrelloRuntime } from '../../TrelloRuntime';
import createCommentLog from './createCommentLog';
import parseCommentLog from './parseCommentLog';

const createLogBuilder = (
  { cache, config, translate }: TrelloRuntime,
  card: TrelloCard
): TrelloLogBuilder => {
  const { userId } = cache.get();

  const commentLog = card.actions.find(
    action =>
      action.type === 'commentCard' &&
      action.memberCreator.id === userId &&
      action.data.text.startsWith(translate('commentLogHeader'))
  );

  const log = commentLog
    ? parseCommentLog(translate, commentLog)
    : createCommentLog(translate, card.id);

  const addEntry = (entry: string) => {
    const time = format(new Date(), 'h:mm aaa');
    const date = format(new Date(), 'MMM d, yyyy');

    const formattedEntry = translate('commentLogEntry', { date, entry, time });

    log.entries = [formattedEntry, ...log.entries];

    return builder;
  };

  const compile = (): string => {
    const text = [
      log.header,
      ' ',
      `---\n${log.timeSpent}\n---`,
      ...log.entries,
      ' ',
      `>*#${btoa(JSON.stringify(log.time))}*`,
      ' ',
      log.footer,
    ].join('\n');

    if (text.length > 16384) {
      delete log.id;
      log.entries = [log.entries[0]];
      log.header = translate('commentLogHeaderContinued');

      return compile();
    }

    return text;
  };

  const removeLastEntry = () => {
    log.entries.shift();

    return builder;
  };

  const save = async () => {
    const text = compile();

    try {
      if (log.id) {
        await updateComment(log.id, text);
      } else {
        const { id } = await addComment(card.id, text);

        log.id = id;
      }
    } catch (error) {
      if (error instanceof Error && error.message === 'no commenting permissions') {
        const notification = new Notification(translate('updateLogErrorHeading'), {
          body: translate('updateLogErrorMessage'),
        });

        notification.addEventListener('click', () => {
          const { currentList } = cache.get();
          const { preferences = {} } = config.get();

          config.set('preferences', {
            ...preferences,
            lists: {
              ...preferences.lists,
              [currentList.id]: {
                ...preferences.lists?.[currentList.id],
                keepLogs: false,
              },
            },
          });
        });
      }
    }
  };

  const updateTimeSpent = (totalTime: number) => {
    log.time.total += totalTime;

    const hours = Math.floor(log.time.total / 3600);
    const minutes = Math.round((log.time.total % 3600) / 60);

    let time = '**';
    const timeKeys: string[] = [];

    if (log.time.total) {
      if (log.time.total < 60) {
        timeKeys.push('UnderMinute');
      } else {
        if (hours) {
          timeKeys.push(hours > 1 ? 'Hours' : 'SingularHour');
        }

        if (minutes) {
          timeKeys.push(minutes > 1 ? 'Minutes' : 'SingularMinute');
        }
      }

      time = translate(`duration${timeKeys.join('')}`, {
        hours: hours.toString(),
        minutes: minutes.toString(),
      });
    }

    log.timeSpent = translate('commentLogTimeSpent', { time });

    return builder;
  };

  const builder = {
    addEntry,
    removeLastEntry,
    save,
    updateTimeSpent,
  };

  return builder;
};

export default createLogBuilder;
