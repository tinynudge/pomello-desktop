import { TrelloRuntime } from './TrelloRuntime';

const getDefaultTrelloHeading = ({ cache, translate }: TrelloRuntime) => {
  const { currentBoard, currentList } = cache.get();

  return translate('boardAndListHeading', { board: currentBoard.name, list: currentList.name });
};

export default getDefaultTrelloHeading;
