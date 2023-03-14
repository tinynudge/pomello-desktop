import { FC } from 'react';

export type InitializingView<TProps = Record<string, unknown>> = FC<
  {
    onReady(options?: OnReadyOptions): void;
  } & TProps
>;

interface OnReadyOptions {
  openTaskSelect?: boolean;
}
