import { ReactNode } from 'react';

interface ErrorHandlerOptions {
  error: Error;
  resetErrorBoundary(): void;
}

export type ErrorHandler = (options: ErrorHandlerOptions) => ReactNode | void;
