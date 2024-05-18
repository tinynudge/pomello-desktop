export type BoundObject<TContext, TObject extends ObjectToBind<TContext>> = {
  [K in keyof TObject]: BoundMethod<TContext, TObject[K]>;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type MethodToBind<TContext> = (context: TContext, ...args: any[]) => any;

type ObjectToBind<TContext> = Record<string, MethodToBind<TContext>>;

type BoundMethod<TContext, TMethod extends MethodToBind<TContext>> = TMethod extends (
  context: TContext,
  ...args: infer TArguments
) => infer TResponse
  ? (...args: TArguments) => TResponse
  : never;

export const bindContext = <TContext, TObject extends ObjectToBind<TContext>>(
  object: TObject,
  context: TContext
): BoundObject<TContext, TObject> => {
  const result = {} as ObjectToBind<TContext>;

  Object.entries(object).forEach(([key, value]) => {
    result[key] = typeof value === 'function' ? value.bind(undefined, context) : value;
  });

  return result as BoundObject<TContext, TObject>;
};
