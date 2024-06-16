import { CreateTaskResponse } from './CreateTaskResponse';

export type OnTaskCreateResponse = {
  createTask?(): CreateTaskResponse | Promise<CreateTaskResponse>;
  notification?: [title: string, body?: string];
} | void;
