export type TaskCompletePromptHandledEvent = {
  invalidateTasksCache(): void;
  optionId: string;
  taskId: string;
};
