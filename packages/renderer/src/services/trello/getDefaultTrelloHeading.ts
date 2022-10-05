import assertNonNullish from '@/shared/helpers/assertNonNullish';
import { Cache, Translate } from '@domain';
import { TrelloCache } from './domain';

const getDefaultTrelloHeading = (cache: Cache<TrelloCache>, translate: Translate) => {
  const { boards, currentListId, lists } = cache.get();

  const currentList = lists.get(currentListId);

  assertNonNullish(currentList, 'Unable to get current list');

  const currentBoard = boards.get(currentList?.idBoard);

  assertNonNullish(currentBoard, 'Unable to get current board');

  return translate('boardAndListHeading', { board: currentBoard.name, list: currentList.name });
};

export default getDefaultTrelloHeading;
