import { PomelloEvent, TaskTimerEndPromptHandledAction } from '@tinynudge/pomello-service';
import { FC } from 'react';
import { CustomSelectGroupComponent } from './CustomSelectGroupComponent';
import { CustomSelectOptionComponent } from './CustomSelectOptionComponent';
import { ErrorHandler } from './ErrorHandler';
import { InitializingView } from './InitializingView';
import { OnNoteCreate } from './OnNoteCreate';
import { OnTaskCreate } from './OnTaskCreate';
import { PomelloEventType } from './PomelloEventType';
import { SelectItem } from './SelectItem';
import { SelectOptionType } from './SelectOptionType';
import { SelectTaskView } from './SelectTaskView';
import { ServiceContainer } from './ServiceContainer';
import { TaskCompleteItems } from './TaskCompleteItems';
import { TaskTimerEndItems } from './TaskTimerEndItems';

export interface Service {
  AuthView?: FC;
  Container?: ServiceContainer;
  CustomSelectGroup?: CustomSelectGroupComponent;
  CustomSelectOption?: CustomSelectOptionComponent;
  displayName: string;
  fetchTasks(): Promise<SelectItem[]>;
  getSelectTaskHeading?(): string;
  getTaskCompleteItems?(taskId: string): TaskCompleteItems;
  getTaskHeading?(): string;
  getTaskLabel?(task: SelectOptionType): string;
  getTaskTimerEndItems?(currentTaskId: string): TaskTimerEndItems;
  handleError?: ErrorHandler;
  id: string;
  InitializingView?: InitializingView;
  onMount?(): void;
  onNoteCreate?: OnNoteCreate;
  onPomelloEvent?(type: PomelloEventType, event: PomelloEvent): void;
  onTaskCompletePromptHandled?(taskId: string, action: string): void;
  onTaskCreate?: OnTaskCreate;
  onTaskSelect?(taskId: string): boolean | void;
  onTaskTimerEndPromptHandled?(
    taskId: string,
    action: string
  ): TaskTimerEndPromptHandledAction | void;
  onUnmount?(): void;
  SelectTaskView?: SelectTaskView;
}
