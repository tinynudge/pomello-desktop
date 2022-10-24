import { Translate } from '@domain';
import { TrelloLog } from '../../domain';

const createCommentLog = (translate: Translate, cardId: string): TrelloLog => {
  return {
    cardId,
    entries: [],
    footer: translate('commentLogFooter'),
    header: translate('commentLogHeader'),
    time: { total: 0 },
    timeSpent: translate('commentLogTimeSpent', { time: '**' }),
  };
};

export default createCommentLog;
