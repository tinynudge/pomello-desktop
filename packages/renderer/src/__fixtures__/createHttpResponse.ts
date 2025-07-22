import { DefaultBodyType, HttpResponse, HttpResponseResolver, PathParams } from 'msw';

export const createHttpResponse = <
  TResponseBody extends DefaultBodyType = DefaultBodyType,
  TRequestBody extends DefaultBodyType = DefaultBodyType,
>(
  defaults: TResponseBody,
  resolver?: TResponseBody | HttpResponseResolver<PathParams, TRequestBody, TResponseBody>
): HttpResponseResolver<PathParams, TRequestBody, TResponseBody> => {
  if (typeof resolver === 'function') {
    return resolver as HttpResponseResolver<PathParams, TRequestBody, TResponseBody>;
  }

  return () =>
    HttpResponse.json(resolver ?? defaults) as ReturnType<
      HttpResponseResolver<PathParams, TRequestBody, TResponseBody>
    >;
};
