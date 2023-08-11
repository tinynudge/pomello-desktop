export interface ErrorHandlerProps {
  error: Error;
  resetErrorBoundary(): void;
}
