import { generatePomelloUser } from '@/app/__fixtures__/generatePomelloUser';
import { createPomelloApi } from '@/shared/helpers/createPomelloApi';
import {
  PomelloApi,
  PomelloApiResponse,
  PomelloServiceConfig,
  PomelloTrackingEvent,
  PomelloUser,
  ServiceConfig,
} from '@pomello-desktop/domain';
import { DefaultBodyType, HttpResponse, HttpResponseResolver, PathParams, http } from 'msw';
import { v4 as uuid } from 'uuid';
import { Mocked, vi } from 'vitest';
import { CreatedPomelloTrackingEvent } from '../../../domain/src/CreatedPomelloTrackingEvent';
import { createHttpResponse } from './createHttpResponse';
import { mockServer } from './mockServer';

export type PomelloApiResponses = {
  [K in keyof PomelloApi]:
    | PomelloApiResponse<Awaited<ReturnType<PomelloApi[K]>>>
    | HttpResponseResolver<
        PathParams,
        DefaultBodyType,
        PomelloApiResponse<Awaited<ReturnType<PomelloApi[K]>>>
      >;
};

export const createMockPomelloApi = (
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
    logEvent: async ({ request }) => {
      const event = (await request.json()) as PomelloTrackingEvent;

      const data = {
        ...event,
        id: uuid(),
      };

      return HttpResponse.json({ data });
    },
    ...pomelloApiResponseOverrides,
  };

  mockServer.use(
    http.get(
      `${import.meta.env.VITE_APP_URL}/api/users`,
      createHttpResponse<PomelloApiResponse<PomelloUser>>(
        generatePomelloUser(),
        pomelloApiResponses.fetchUser
      )
    ),
    http.post(
      `${import.meta.env.VITE_APP_URL}/api/events`,
      createHttpResponse<PomelloApiResponse<CreatedPomelloTrackingEvent>>(
        { data: {} as CreatedPomelloTrackingEvent },
        pomelloApiResponses.logEvent
      )
    )
  );

  return pomelloApi;
};
