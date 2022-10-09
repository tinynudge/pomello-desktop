import createCard from './createCard';
import fetchBoardsAndLists from './fetchBoardsAndLists';
import fetchCardsByListId from './fetchCardsByListId';
import fetchLabelsByBoardId from './fetchLabelsByBoardId';
import markCheckItemComplete from './markCheckItemComplete';
import moveCardToList from './moveCardToList';

const api = {
  createCard,
  fetchBoardsAndLists,
  fetchCardsByListId,
  fetchLabelsByBoardId,
  markCheckItemComplete,
  moveCardToList,
};

export default api;
