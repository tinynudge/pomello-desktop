import mountApp from '@/app/__fixtures__/mountApp';
import createMockCache from '@/__fixtures__/createMockCache';
import createMockServiceConfig from '@/__fixtures__/createMockServiceConfig';
import createRestResolver from '@/__fixtures__/createRestResolver';
import mockRegisterServiceConfig from '@/__fixtures__/mockRegisterServiceConfig';
import mockServer from '@/__fixtures__/mockServer';
import { Cache, Settings } from '@domain';
import { ResponseResolver, rest, RestContext, RestRequest } from 'msw';
import { vi } from 'vitest';
import createTrelloService from '..';
import { TRELLO_API_URL } from '../constants';
import {
  TrelloCache,
  TrelloCard,
  TrelloCardAction,
  TrelloCheckItem,
  TrelloConfig,
  TrelloLabel,
  TrelloMember,
} from '../domain';
import translations from '../translations/en-US.json';
import generateTrelloCard from './generateTrelloCard';
import generateTrelloCardAction from './generateTrelloCardAction';
import generateTrelloCheckItem from './generateTrelloCheckItem';
import generateTrelloLabel from './generateTrelloLabel';
import generateTrelloMember from './generateTrelloMember';

export * from '@testing-library/react';

interface TrelloApiResponses {
  addComment: TrelloCardAction | ResponseResolver<RestRequest, RestContext, TrelloCardAction>;
  createCard: TrelloCard | ResponseResolver<RestRequest, RestContext, TrelloCard>;
  fetchBoardsAndLists: TrelloMember | ResponseResolver<RestRequest, RestContext, TrelloMember>;
  fetchCardsByListId: TrelloCard[] | ResponseResolver<RestRequest, RestContext, TrelloCard[]>;
  fetchLabelsByBoardId: TrelloLabel[] | ResponseResolver<RestRequest, RestContext, TrelloLabel[]>;
  markCheckItemComplete:
    | TrelloCheckItem
    | ResponseResolver<RestRequest, RestContext, TrelloCheckItem>;
  moveCardToList: TrelloCard | ResponseResolver<RestRequest, RestContext, TrelloCard>;
  updateComment: TrelloCardAction | ResponseResolver<RestRequest, RestContext, TrelloCardAction>;
}

interface MountTrelloServiceOptions {
  appApi?: Partial<AppApi>;
  config?: Partial<TrelloConfig>;
  settings?: Partial<Settings>;
  trelloApi?: Partial<TrelloApiResponses>;
}

let cache: Cache<TrelloCache>;

vi.mock('@/shared/helpers/createCache', () => ({
  default: () => cache,
}));

const mountTrelloService = async ({
  appApi,
  config: initialConfig,
  settings,
  trelloApi,
}: MountTrelloServiceOptions = {}) => {
  cache = createMockCache<TrelloCache>();

  mockServer.resetHandlers(
    rest.get(
      `${TRELLO_API_URL}members/me`,
      createRestResolver<TrelloMember>(generateTrelloMember(), trelloApi?.fetchBoardsAndLists)
    ),
    rest.get(
      `${TRELLO_API_URL}boards/:boardId/labels`,
      createRestResolver<TrelloLabel[]>([generateTrelloLabel()], trelloApi?.fetchLabelsByBoardId)
    ),
    rest.get(
      `${TRELLO_API_URL}lists/:listId/cards`,
      createRestResolver<TrelloCard[]>([generateTrelloCard()], trelloApi?.fetchCardsByListId)
    ),
    rest.post(
      `${TRELLO_API_URL}cards`,
      createRestResolver<TrelloCard>(generateTrelloCard(), trelloApi?.createCard)
    ),
    rest.post(
      `${TRELLO_API_URL}cards/:idCard/actions/comments`,
      createRestResolver<TrelloCardAction>(generateTrelloCardAction(), trelloApi?.addComment)
    ),
    rest.put(
      `${TRELLO_API_URL}cards/:idCard/checkItem/:idCheckItem`,
      createRestResolver<TrelloCheckItem>(
        generateTrelloCheckItem(),
        trelloApi?.markCheckItemComplete
      )
    ),
    rest.put(
      `${TRELLO_API_URL}cards/:idCard`,
      createRestResolver<TrelloCard>(generateTrelloCard(), trelloApi?.moveCardToList)
    ),
    rest.put(
      `${TRELLO_API_URL}actions/:idAction`,
      createRestResolver<TrelloCardAction>(generateTrelloCardAction(), trelloApi?.updateComment)
    )
  );

  const configActions = mockRegisterServiceConfig<TrelloConfig>(createTrelloService.id, {
    token: 'MY_TRELLO_TOKEN',
    currentList: 'TRELLO_LIST_ID',
    ...initialConfig,
  });
  const config = createMockServiceConfig(configActions);

  const results = mountApp({
    appApi: {
      registerServiceConfig: () => Promise.resolve(configActions) as any,
      getTranslations: () => Promise.resolve(translations),
      ...appApi,
    },
    createServiceRegistry: () => ({
      [createTrelloService.id]: createTrelloService,
    }),
    serviceId: createTrelloService.id,
    settings,
  });

  return {
    ...results,
    cache,
    config,
  };
};

export default mountTrelloService;
