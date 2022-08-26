import { FC } from 'react';

export type SelectTaskView<TProps = Record<string, unknown>> = FC<
  {
    selectTask(taskId: string): void;
  } & TProps
>;
