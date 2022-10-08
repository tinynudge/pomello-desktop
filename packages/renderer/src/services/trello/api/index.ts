import fetchBoardsAndLists from './fetchBoardsAndLists';
import fetchCardsByListId from './fetchCardsByListId';
import markCheckItemComplete from './markCheckItemComplete';
import moveCardToList from './moveCardToList';

const api = {
  fetchBoardsAndLists,
  fetchCardsByListId,
  markCheckItemComplete,
  moveCardToList,
};

export default api;
