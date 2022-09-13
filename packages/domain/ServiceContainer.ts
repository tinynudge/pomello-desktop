import { FC, ReactNode } from 'react';

export type ServiceContainer<TProps = Record<string, unknown>> = FC<
  { children: ReactNode } & TProps
>;
