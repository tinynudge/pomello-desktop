export type CreateTaskResponse = {
  notification?: [title: string, body?: string];
  shouldInvalidateTasksCache?: boolean;
} | void;
