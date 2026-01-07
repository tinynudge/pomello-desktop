import { createHttpResponse } from '@/__fixtures__/createHttpResponse';
import { createMockServiceConfig } from '@/__fixtures__/createMockServiceConfig';
import { mockServer } from '@/__fixtures__/mockServer';
import { renderApp, RenderAppOptions } from '@/app/__fixtures__/renderApp';
import { DefaultBodyType, http, HttpResponseResolver, PathParams } from 'msw';
import { createTrelloService } from '..';
import { TRELLO_API_URL } from '../constants';
import {
  TrelloCache,
  TrelloCard,
  TrelloCardAction,
  TrelloCheckItem,
  TrelloConfigStore,
  TrelloLabel,
  TrelloMember,
} from '../domain';
import translations from '../translations/en-US.json';
import { generateTrelloCard } from './generateTrelloCard';
import { generateTrelloCardAction } from './generateTrelloCardAction';
import { generateTrelloCheckItem } from './generateTrelloCheckItem';
import { generateTrelloLabel } from './generateTrelloLabel';
import { generateTrelloMember } from './generateTrelloMember';

export * from '@solidjs/testing-library';

type TrelloApiResponses = {
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

type RenderTrelloServiceOptions = Pick<RenderAppOptions, 'appApi' | 'pomelloApi' | 'settings'> & {
  config?: Partial<TrelloConfigStore>;
  trelloApi?: Partial<TrelloApiResponses>;
};

const originalCreateTrelloCache = vi.hoisted(async () => {
  const { createTrelloCache } = await import('@/services/trello/createTrelloCache');

  return createTrelloCache;
});

let cache: TrelloCache;

vi.mock('@/services/trello/createTrelloCache.ts', () => ({
  createTrelloCache: () => cache,
}));

export const renderTrelloService = async ({
  appApi,
  config: initialConfig,
  trelloApi,
  ...remainingOptions
}: RenderTrelloServiceOptions = {}) => {
  cache = (await originalCreateTrelloCache)();

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

  const [config, configActions] = createMockServiceConfig(createTrelloService.id, {
    token: 'MY_TRELLO_TOKEN',
    currentList: 'TRELLO_LIST_ID',
    ...initialConfig,
  });

  const results = renderApp({
    appApi: {
      getTranslations: () => Promise.resolve(translations),
      ...appApi,
    },
    createServiceRegistry: () => ({
      [createTrelloService.id]: createTrelloService,
    }),
    serviceConfigs: {
      trello: configActions,
    },
    serviceId: createTrelloService.id,
    ...remainingOptions,
  });

  return {
    ...results,
    cache,
    config,
  };
};
