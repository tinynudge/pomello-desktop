import { Cache, Translate } from '@domain';
import { TrelloCache } from './domain';

const getDefaultTrelloHeading = (cache: Cache<TrelloCache>, translate: Translate) => {
  const { currentBoard, currentList } = cache.get();

  return translate('boardAndListHeading', { board: currentBoard.name, list: currentList.name });
};

export default getDefaultTrelloHeading;
