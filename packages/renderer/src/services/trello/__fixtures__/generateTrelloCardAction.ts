import { TrelloCardAction } from '../domain';

type DeepPartial<T> = Partial<{ [P in keyof T]: DeepPartial<T[P]> }>;

export const generateTrelloCardAction = (
  values: DeepPartial<TrelloCardAction> = {}
): TrelloCardAction => ({
  id: values.id ?? 'TRELLO_ACTION_ID',
  data: {
    text: 'This is some text',
    ...values.data,
    card: {
      id: 'TRELLO_CARD_ID',
      name: 'My Trello card',
      ...values.data?.card,
    },
    board: {
      id: 'TRELLO_BOARD_ID',
      name: 'My Trello board',
      ...values.data?.board,
    },
    list: {
      id: 'TRELLO_LIST_ID',
      name: 'My Trello list',
      ...values.data?.list,
    },
  },
  type: values.type ?? 'commentCard',
  date: values.date ?? '',
  memberCreator: {
    id: 'TRELLO_USER_ID',
    ...values.memberCreator,
  },
});
