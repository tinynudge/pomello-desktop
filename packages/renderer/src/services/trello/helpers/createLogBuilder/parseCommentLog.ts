import { Translate } from '@domain';
import { TrelloCardAction, TrelloLog, TrelloLogTime } from '../../domain';

const parseCommentLog = (translate: Translate, log: TrelloCardAction): TrelloLog => {
  const lines = log.data.text.split('\n');

  const header = lines.splice(0, 2)[0];
  const timeSpent = lines.splice(0, 3)[1];

  const footer = lines.pop() ?? translate('commentLogFooter');
  const encodedJson = lines.splice(-3)[1];

  let time: TrelloLogTime;
  try {
    time = JSON.parse(atob(encodedJson.substring(3, encodedJson.length - 1)));

    if (Array.isArray(time)) {
      const total = time.reduce((currentTime, [start, stop = 0]) => {
        return currentTime + (start - stop);
      }, 0);

      time = { total };
    }
  } catch {
    time = { total: 0 };
  }

  return {
    id: log.id,
    cardId: log.data.card.id,
    header,
    timeSpent,
    footer,
    time,
    entries: lines,
  };
};

export default parseCommentLog;
