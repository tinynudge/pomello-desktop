import { Note } from '@pomello-desktop/domain';
import { addComment } from './api/addComment';
import { TrelloRuntime } from './domain';

export const onNoteCreate = async (
  runtime: TrelloRuntime,
  taskId: string,
  note: Note
): Promise<void> => {
  const { cache, logger, translate } = runtime;
  const log = cache.store.log;
  const preferences = cache.store.preferences;

  const formattedNote = translate('noteEntry', { label: note.label, text: note.text });

  if (preferences.keepLogs && log) {
    log.addEntry(formattedNote).save();
  } else {
    try {
      logger.debug('Will create Trello comment');

      await addComment(taskId, formattedNote);

      logger.debug('Did create Trello comment');
    } catch (error) {
      logger.debug({
        message: 'Failed to create Trello comment',
        error,
      });
    }
  }
};
