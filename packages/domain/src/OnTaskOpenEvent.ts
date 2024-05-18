export interface OnTaskOpenEvent {
  taskId: string;
  openUrl(url: string): void;
}
