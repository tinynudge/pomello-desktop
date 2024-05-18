import { JSX } from 'solid-js';

type ErrorHandlerOptions = {
  error: Error;
  resetErrorBoundary(): void;
};

export type ErrorHandler = (options: ErrorHandlerOptions) => (() => JSX.Element) | void;
