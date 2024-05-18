export interface TaskTimerEndPromptHandledEvent {
  invalidateTasksCache(): void;
  optionId: string;
  taskId: string;
}
