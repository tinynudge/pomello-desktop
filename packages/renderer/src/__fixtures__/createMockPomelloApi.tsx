import generatePomelloUser from '@/app/__fixtures__/generatePomelloUser';
import createPomelloApi from '@/shared/helpers/createPomelloApi';
import {
  PomelloApi,
  PomelloApiResponse,
  PomelloApiResponses,
  PomelloServiceConfig,
  PomelloTrackingEvent,
  PomelloUser,
  ServiceConfig,
} from '@domain';
import { rest } from 'msw';
import { v4 as uuid } from 'uuid';
import { Mocked, vi } from 'vitest';
import { CreatedPomelloTrackingEvent } from '../../../domain/CreatedPomelloTrackingEvent';
import createRestResolver from './createRestResolver';
import mockServer from './mockServer';

const createMockPomelloApi = (
  pomelloConfig: ServiceConfig<PomelloServiceConfig>,
  pomelloApiResponseOverrides?: Partial<PomelloApiResponses>
) => {
  const pomelloApi = createPomelloApi(pomelloConfig) as Mocked<PomelloApi>;

  Object.keys(pomelloApi).forEach(key => {
    vi.spyOn(pomelloApi, key as keyof PomelloApi);
  });

  // Create a default logEvent response that adds a unique ID to the event that
  // was passed in to the request.
  const pomelloApiResponses: Partial<PomelloApiResponses> = {
    logEvent: async (request, response, context) => {
      const event = await request.json<PomelloTrackingEvent>();

      const data = {
        ...event,
        id: uuid(),
      };

      return response(context.json({ data }));
    },
    ...pomelloApiResponseOverrides,
  };

  mockServer.use(
    rest.get(
      `${import.meta.env.VITE_APP_URL}/api/users`,
      createRestResolver<PomelloApiResponse<PomelloUser>>(
        generatePomelloUser(),
        pomelloApiResponses.fetchUser
      )
    ),
    rest.post(
      `${import.meta.env.VITE_APP_URL}/api/events`,
      createRestResolver<PomelloApiResponse<CreatedPomelloTrackingEvent>>(
        { data: {} as CreatedPomelloTrackingEvent },
        pomelloApiResponses.logEvent
      )
    )
  );

  return pomelloApi;
};

export default createMockPomelloApi;
