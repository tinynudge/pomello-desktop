import { TaskTimerEndPromptHandledAction } from '@tinynudge/pomello-service';
import { FC } from 'react';
import { AddNoteHandler } from './AddNoteHandler';
import { CreateTaskHandler } from './CreateTaskHandler';
import { CustomSelectGroupComponent } from './CustomSelectGroupComponent';
import { CustomSelectOptionComponent } from './CustomSelectOptionComponent';
import { ErrorHandler } from './ErrorHandler';
import { InitializingView } from './InitializingView';
import { SelectItem } from './SelectItem';
import { SelectOptionType } from './SelectOptionType';
import { SelectTaskView } from './SelectTaskView';
import { ServiceContainer } from './ServiceContainer';
import { TaskTimerEndItems } from './TaskTimerEndItems';

export interface Service {
  AuthView?: FC;
  Container?: ServiceContainer;
  CustomSelectGroup?: CustomSelectGroupComponent;
  CustomSelectOption?: CustomSelectOptionComponent;
  displayName: string;
  fetchTasks(): Promise<SelectItem[]>;
  getCompleteTaskOptions?(taskId: string): SelectItem[] | void;
  getSelectTaskHeading?(): string;
  getTaskHeading?(): string;
  getTaskLabel?(task: SelectOptionType): string;
  getTaskTimerEndItems?(): TaskTimerEndItems;
  handleError?: ErrorHandler;
  handleNoteAdd?: AddNoteHandler;
  handleTaskCreate?: CreateTaskHandler;
  id: string;
  InitializingView?: InitializingView;
  onMount?(): void;
  onTaskCompletePromptHandled?(taskId: string, action: string): void;
  onTaskTimerEndPromptHandled?(
    task: SelectOptionType,
    action: string
  ): TaskTimerEndPromptHandledAction | void;
  onUnmount?(): void;
  SelectTaskView?: SelectTaskView;
}
