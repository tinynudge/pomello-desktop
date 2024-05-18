import { Component } from 'solid-js';

export type SelectTaskView<TProps = Record<string, unknown>> = Component<
  {
    selectTask(taskId: string): void;
  } & TProps
>;
