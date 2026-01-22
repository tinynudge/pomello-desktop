import { TrelloBoard, TrelloList } from '.';

export type BoardOrList = Board | List;

type Board = {
  item: TrelloBoard;
  type: 'board';
};

type List = {
  item: TrelloList;
  type: 'list';
};
