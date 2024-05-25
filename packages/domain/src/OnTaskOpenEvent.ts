export type OnTaskOpenEvent = {
  taskId: string;
  openUrl(url: string): void;
};
