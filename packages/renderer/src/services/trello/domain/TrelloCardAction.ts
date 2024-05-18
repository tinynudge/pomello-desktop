export type TrelloCardAction = {
  id: string;
  data: {
    text: string;
    card: {
      id: string;
      name: string;
    };
    board: {
      id: string;
      name: string;
    };
    list: {
      id: string;
      name: string;
    };
  };
  type: string;
  date: string;
  memberCreator: {
    id: string;
  };
};
