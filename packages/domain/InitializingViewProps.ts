export type InitializingViewProps = {
  onReady(options?: OnReadyOptions): void;
};

interface OnReadyOptions {
  openTaskSelect?: boolean;
}
