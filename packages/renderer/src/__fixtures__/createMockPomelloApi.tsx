import { generatePomelloUser } from '@/app/__fixtures__/generatePomelloUser';
import { createPomelloApi } from '@/shared/helpers/createPomelloApi';
import {
  PomelloApi,
  PomelloApiResponse,
  PomelloServiceConfig,
  PomelloUser,
  ServiceConfig,
} from '@pomello-desktop/domain';
import { SavedTrackingEvent, TrackingEventWithServiceData } from '@tinynudge/pomello-service';
import { DefaultBodyType, HttpResponse, HttpResponseResolver, PathParams, http } from 'msw';
import { nanoid } from 'nanoid';
import { Mocked, vi } from 'vitest';
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
      const event = (await request.json()) as TrackingEventWithServiceData;

      const data = {
        ...event,
        id: nanoid(),
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
      createHttpResponse<PomelloApiResponse<SavedTrackingEvent>>(
        { data: {} as SavedTrackingEvent },
        pomelloApiResponses.logEvent
      )
    )
  );

  return pomelloApi;
};
