export interface ErrorOverlayProps {
  heading?: string;
  message?: string;
  error: unknown;
  retryAction?: {
    label: string;
    onClick(): void;
  };
}
