import { Note } from '@domain';
import { TrelloCard } from './domain';
import createLogBuilder from './helpers/createLogBuilder';
import findOrFailTask from './helpers/findOrFailTask';
import isCheckItem from './helpers/isCheckItem';
import { TrelloRuntime } from './TrelloRuntime';

const onNoteCreate = (runtime: TrelloRuntime, taskId: string, note: Note): void => {
  const { api, cache, translate } = runtime;
  const { preferences } = cache.get();

  const formattedNote = translate('noteEntry', { label: note.label, text: note.text });

  if (preferences.keepLogs) {
    let card = findOrFailTask(cache, taskId);

    if (isCheckItem(card)) {
      card = findOrFailTask(cache, card.idCard) as TrelloCard;
    }

    createLogBuilder(runtime, card).addEntry(formattedNote).save();
  } else {
    api.addComment(taskId, formattedNote);
  }
};

export default onNoteCreate;
