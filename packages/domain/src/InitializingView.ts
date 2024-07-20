import { Component } from 'solid-js';

export type InitializingView<TProps = Record<string, unknown>> = Component<
  {
    onReady(options?: OnReadyOptions): void;
  } & TProps
>;

type OnReadyOptions = {
  openTaskSelect?: boolean;
};
