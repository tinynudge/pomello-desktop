export type TaskTimerEndPromptHandledEvent = {
  invalidateTasksCache(): void;
  optionId: string;
  taskId: string;
};
