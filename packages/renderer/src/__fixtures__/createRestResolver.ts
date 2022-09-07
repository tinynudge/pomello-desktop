import { ResponseResolver, RestContext, RestRequest } from 'msw';

const createRestResolver = <TBody = unknown>(
  defaults: TBody,
  resolver?: TBody | ResponseResolver<RestRequest, RestContext, TBody>
): ResponseResolver<RestRequest, RestContext, TBody> => {
  if (typeof resolver === 'function') {
    return resolver as ResponseResolver<RestRequest, RestContext, TBody>;
  }

  return (_request, response, context) => response(context.json(resolver ?? defaults));
};

export default createRestResolver;
