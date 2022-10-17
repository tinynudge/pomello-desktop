import { format } from 'date-fns';
import { TrelloCard, TrelloLogBuilder } from '../../domain';
import { TrelloRuntime } from '../../TrelloRuntime';
import createCommentLog from './createCommentLog';
import parseCommentLog from './parseCommentLog';

const createLogBuilder = (
  { api, cache, config, translate }: TrelloRuntime,
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
      log.timeSpent,
      ...log.entries,
      ' ',
      `>*#${btoa(JSON.stringify(log.json))}*`,
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

  const save = async () => {
    const text = compile();

    try {
      if (log.id) {
        await api.updateComment(log.id, text);
      } else {
        await api.addComment(card.id, text);
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

  const builder = {
    addEntry,
    save,
  };

  return builder;
};

export default createLogBuilder;
