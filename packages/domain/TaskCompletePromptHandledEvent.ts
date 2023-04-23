export interface TaskCompletePromptHandledEvent {
  invalidateTasksCache(): void;
  optionId: string;
  taskId: string;
}
