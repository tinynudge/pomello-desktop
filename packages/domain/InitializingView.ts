import { FC } from 'react';

export type InitializingView<TProps = Record<string, unknown>> = FC<
  {
    onReady(): void;
  } & TProps
>;
