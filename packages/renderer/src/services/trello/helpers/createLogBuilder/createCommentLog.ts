import { Translate } from '@domain';
import { TrelloLog } from '../../domain';

const createCommentLog = (translate: Translate, cardId: string): TrelloLog => {
  return {
    cardId,
    entries: [],
    footer: translate('commentLogFooter'),
    header: translate('commentLogHeader'),
    json: [],
    timeSpent: `---\n${translate('commentLogTimeSpent', { time: '**' })}\n---`,
  };
};

export default createCommentLog;
