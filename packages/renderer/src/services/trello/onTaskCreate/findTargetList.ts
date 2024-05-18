import { TrelloBoard, TrelloList, TrelloRuntime } from '../domain';
import { createQueryRegex } from './createQueryRegex';

export const findTargetList = (
  { cache, translate }: TrelloRuntime,
  input?: string
): TrelloList | undefined => {
  const boards = cache.store.boards;
  const currentBoard = cache.store.currentBoard;
  const currentList = cache.store.currentList;

  if (!input) {
    return currentList;
  }

  let [boardQuery, listQuery] = input.split('/');
  if (!listQuery) {
    listQuery = boardQuery;
    boardQuery = '';
  }

  let board: TrelloBoard | undefined;
  if (boardQuery) {
    const boardRegex = createQueryRegex(boardQuery);
    const foundBoards = Array.from(boards.values()).filter(({ name }) => boardRegex.test(name));

    if (foundBoards.length === 1) {
      board = foundBoards[0];
    } else if (foundBoards.length === 0) {
      new Notification(translate('createTaskNoBoardsFound', { query: boardQuery }));
    } else {
      new Notification(translate('createTaskTooManyBoardsFound', { query: boardQuery }));
    }
  } else {
    board = currentBoard;
  }

  if (board) {
    const listRegex = createQueryRegex(listQuery);
    const foundLists = board.lists.filter(({ name }) => listRegex.test(name));

    if (foundLists.length === 1) {
      return foundLists[0];
    } else if (foundLists.length === 0) {
      new Notification(translate('createTaskNoListsFound', { query: listQuery }));
    } else {
      new Notification(translate('createTaskTooManyListsFound', { query: listQuery }));
    }
  }
};
