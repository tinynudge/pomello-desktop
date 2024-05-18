import { TrelloRuntime } from './domain';

export const getDefaultTrelloHeading = ({ cache, translate }: TrelloRuntime) => {
  const currentBoard = cache.store.currentBoard;
  const currentList = cache.store.currentList;

  return translate('boardAndListHeading', {
    board: currentBoard.name,
    list: currentList.name,
  });
};
