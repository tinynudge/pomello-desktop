import { Note } from '@domain';
import addComment from './api/addComment';
import { TrelloRuntime } from './TrelloRuntime';

const onNoteCreate = (runtime: TrelloRuntime, taskId: string, note: Note): void => {
  const { cache, translate } = runtime;
  const { log, preferences } = cache.get();

  const formattedNote = translate('noteEntry', { label: note.label, text: note.text });

  if (preferences.keepLogs && log) {
    log.addEntry(formattedNote).save();
  } else {
    addComment(taskId, formattedNote);
  }
};

export default onNoteCreate;
