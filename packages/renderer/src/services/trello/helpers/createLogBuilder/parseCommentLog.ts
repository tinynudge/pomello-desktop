import { Translate } from '@domain';
import { TrelloCardAction, TrelloLog } from '../../domain';

const parseCommentLog = (translate: Translate, log: TrelloCardAction): TrelloLog => {
  const lines = log.data.text.split('\n');

  const header = lines.splice(0, 2)[0];
  const timeSpent = lines.splice(0, 3).join('\n');
  const footer = lines.pop() ?? translate('commentLogFooter');
  const encodedJson = lines.splice(-3)[1];

  let json: string[];
  try {
    json = JSON.parse(atob(encodedJson.substring(3, encodedJson.length - 1)));
  } catch {
    json = [];
  }

  return {
    id: log.id,
    cardId: log.data.card.id,
    header,
    timeSpent,
    footer,
    json,
    entries: lines,
  };
};

export default parseCommentLog;
