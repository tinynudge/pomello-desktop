import { createHttpResponse } from '@/__fixtures__/createHttpResponse';
import { mockServer } from '@/__fixtures__/mockServer';
import { DefaultBodyType, http, HttpResponseResolver, PathParams } from 'msw';
import { TRELLO_API_URL } from '../constants';
import {
  TrelloCard,
  TrelloCardAction,
  TrelloCheckItem,
  TrelloLabel,
  TrelloMember,
} from '../domain';
import { generateTrelloCard } from './generateTrelloCard';
import { generateTrelloCardAction } from './generateTrelloCardAction';
import { generateTrelloCheckItem } from './generateTrelloCheckItem';
import { generateTrelloLabel } from './generateTrelloLabel';
import { generateTrelloMember } from './generateTrelloMember';

export type TrelloApiResponses = {
  addComment:
    | TrelloCardAction
    | HttpResponseResolver<PathParams, DefaultBodyType, TrelloCardAction>;
  createCard: TrelloCard | HttpResponseResolver<PathParams, DefaultBodyType, TrelloCard>;
  fetchBoardsAndLists:
    | TrelloMember
    | HttpResponseResolver<PathParams, DefaultBodyType, TrelloMember>;
  fetchCardsByListId:
    | TrelloCard[]
    | HttpResponseResolver<PathParams, DefaultBodyType, TrelloCard[]>;
  fetchLabelsByBoardId:
    | TrelloLabel[]
    | HttpResponseResolver<PathParams, DefaultBodyType, TrelloLabel[]>;
  markCheckItemComplete:
    | TrelloCheckItem
    | HttpResponseResolver<PathParams, DefaultBodyType, TrelloCheckItem>;
  moveCardToList: TrelloCard | HttpResponseResolver<PathParams, DefaultBodyType, TrelloCard>;
  updateComment:
    | TrelloCardAction
    | HttpResponseResolver<PathParams, DefaultBodyType, TrelloCardAction>;
};

export const mockTrelloApi = (trelloApi?: Partial<TrelloApiResponses>): void => {
  mockServer.use(
    http.get(
      `${TRELLO_API_URL}members/me`,
      createHttpResponse<TrelloMember>(generateTrelloMember(), trelloApi?.fetchBoardsAndLists)
    ),
    http.get(
      `${TRELLO_API_URL}boards/:boardId/labels`,
      createHttpResponse<TrelloLabel[]>([generateTrelloLabel()], trelloApi?.fetchLabelsByBoardId)
    ),
    http.get(
      `${TRELLO_API_URL}lists/:listId/cards`,
      createHttpResponse<TrelloCard[]>([generateTrelloCard()], trelloApi?.fetchCardsByListId)
    ),
    http.post(
      `${TRELLO_API_URL}cards`,
      createHttpResponse<TrelloCard>(generateTrelloCard(), trelloApi?.createCard)
    ),
    http.post(
      `${TRELLO_API_URL}cards/:idCard/actions/comments`,
      createHttpResponse<TrelloCardAction>(generateTrelloCardAction(), trelloApi?.addComment)
    ),
    http.put(
      `${TRELLO_API_URL}cards/:idCard/checkItem/:idCheckItem`,
      createHttpResponse<TrelloCheckItem>(
        generateTrelloCheckItem(),
        trelloApi?.markCheckItemComplete
      )
    ),
    http.put(
      `${TRELLO_API_URL}cards/:idCard`,
      createHttpResponse<TrelloCard>(generateTrelloCard(), trelloApi?.moveCardToList)
    ),
    http.put(
      `${TRELLO_API_URL}actions/:idAction`,
      createHttpResponse<TrelloCardAction>(generateTrelloCardAction(), trelloApi?.updateComment)
    )
  );
};
