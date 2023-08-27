import SerializableHttpError from '@/shared/helpers/SerializableHttpError';
import produce from 'immer';
import ky, { Options } from 'ky';
import { TRELLO_API_URL, TRELLO_KEY } from './constants';

const defaultOptions = {
  hooks: {
    beforeError: [
      async error => {
        const message = await error.response.text();
        error.message = message;

        return new SerializableHttpError({
          error,
          message,
          sensitiveSearchParams: ['key', 'token'],
        });
      },
    ],
  },
  prefixUrl: TRELLO_API_URL,
  retry: 0,
  searchParams: {
    key: TRELLO_KEY,
  } as Record<string, string>,
} satisfies Options;

let trelloClient = {
  ...ky.create(defaultOptions),
  setToken: (token: string) => {
    const optionsWithToken = produce(defaultOptions, draft => {
      draft.searchParams.token = token;
    });

    trelloClient = {
      ...trelloClient,
      ...ky.create(optionsWithToken),
    };
  },
  unsetToken: () => {
    trelloClient = {
      ...trelloClient,
      ...ky.create(defaultOptions),
    };
  },
};

const getTrelloClient = () => trelloClient;

export default getTrelloClient;
