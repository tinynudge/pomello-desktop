import { ResponseResolver, RestContext, RestRequest } from 'msw';
import { PomelloApi } from './PomelloApi';
import { PomelloApiResponse } from './PomelloApiResponse';

export type PomelloApiResponses = {
  [K in keyof PomelloApi]:
    | PomelloApiResponse<Awaited<ReturnType<PomelloApi[K]>>>
    | ResponseResolver<
        RestRequest,
        RestContext,
        PomelloApiResponse<Awaited<ReturnType<PomelloApi[K]>>>
      >;
};
