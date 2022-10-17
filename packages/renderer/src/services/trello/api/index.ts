import addComment from './addComment';
import createCard from './createCard';
import fetchBoardsAndLists from './fetchBoardsAndLists';
import fetchCardsByListId from './fetchCardsByListId';
import fetchLabelsByBoardId from './fetchLabelsByBoardId';
import markCheckItemComplete from './markCheckItemComplete';
import moveCardToList from './moveCardToList';
import updateComment from './updateComment';

const api = {
  addComment,
  createCard,
  fetchBoardsAndLists,
  fetchCardsByListId,
  fetchLabelsByBoardId,
  markCheckItemComplete,
  moveCardToList,
  updateComment,
};

export default api;
