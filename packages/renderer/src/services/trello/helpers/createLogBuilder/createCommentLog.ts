import { Translate } from '@pomello-desktop/domain';
import { TrelloLog } from '../../domain';

export const createCommentLog = (translate: Translate, cardId: string): TrelloLog => {
  return {
    cardId,
    entries: [],
    footer: translate('commentLogFooter'),
    header: translate('commentLogHeader'),
    time: { total: 0 },
    timeSpent: translate('commentLogTimeSpent', { time: '**' }),
  };
};
