import {
  CreateFetchTaskNamesOptions,
  FetchTaskNames,
  TaskNamesById,
} from '@pomello-desktop/domain';
import { TrackingEvent } from '@tinynudge/pomello-service';
import { TrelloConfigStore } from './domain';
import { getTrelloClient } from './getTrelloClient';

type TrelloBatchResponse = TrelloBatchSuccessResponse | TrelloBatchErrorResponse;

type TrelloBatchSuccessResponse = {
  200: {
    id: string;
    name: string;
  };
};

type TrelloBatchErrorResponse = {
  message: string;
  name: string;
  statusCode: number;
};

const chunkArray = <T>(array: T[], size: number): T[][] =>
  [...Array(Math.ceil(array.length / size))].map(() => array.splice(0, size));

const updateTrelloClientToken = ({ token: encryptedToken }: TrelloConfigStore) => {
  const trelloClient = getTrelloClient();

  if (encryptedToken) {
    const decryptedToken = window.app.decryptValue(encryptedToken);

    if (decryptedToken) {
      trelloClient.setToken(decryptedToken);

      return;
    }
  }

  trelloClient.unsetToken();
};

export const createFetchTrelloTaskNames = ({
  config,
  onCleanUp,
  logger,
}: CreateFetchTaskNamesOptions<TrelloConfigStore>): FetchTaskNames => {
  updateTrelloClientToken(config.get());

  const unsubscribe = config.onChange(updateTrelloClientToken);

  onCleanUp(() => {
    unsubscribe();
  });

  const fetchTaskNames = async (events: TrackingEvent[]): Promise<TaskNamesById> => {
    if (events.length === 0) {
      return {};
    }

    const trelloClient = getTrelloClient();

    const urls = events.map(({ serviceId, parentServiceId }) => {
      const endpoint = parentServiceId
        ? `/cards/${parentServiceId}/checkItem/${serviceId}`
        : `/cards/${serviceId}`;

      return `${endpoint}?fields=id&fields=name`;
    });

    const chunkedUrls = chunkArray(urls, 10);

    logger.debug('Will fetch Trello task names');

    const chunkedResults = await Promise.allSettled(
      chunkedUrls.map(urlChunk =>
        trelloClient
          .get('batch', {
            searchParams: {
              urls: urlChunk.join(','),
            },
          })
          .json<TrelloBatchResponse[]>()
      )
    );

    const taskNames: TaskNamesById = {};
    let eventIndex = 0;

    for (const chunkResult of chunkedResults) {
      if (chunkResult.status === 'fulfilled') {
        for (const response of chunkResult.value) {
          const event = events[eventIndex];

          if ('200' in response) {
            taskNames[event.serviceId] = response[200].name;
          } else {
            taskNames[event.serviceId] = new Error(response.message);
          }

          eventIndex += 1;
        }
      } else {
        logger.debug(`Failed to fetch batched request: ${chunkResult.reason}`);

        eventIndex += Math.min(10, urls.length - eventIndex);
      }
    }

    logger.debug('Did fetch Trello task names');

    return taskNames;
  };

  return fetchTaskNames;
};
