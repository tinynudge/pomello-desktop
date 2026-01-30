import { Component } from 'solid-js';
import { CustomSelectGroupComponent } from './CustomSelectGroupComponent';
import { CustomSelectOptionComponent } from './CustomSelectOptionComponent';
import { ErrorHandler } from './ErrorHandler';
import { GetTaskCompleteItemsParams } from './GetTaskCompleteItemsParams';
import { GetTrackingEventServiceDataResponse } from './GetTrackingEventServiceDataResponse';
import { InitializingView } from './InitializingView';
import { OnNoteCreate } from './OnNoteCreate';
import { OnTaskCreate } from './OnTaskCreate';
import { OnTaskOpenEvent } from './OnTaskOpenEvent';
import { PomelloEventListeners } from './PomelloEventListeners';
import { SelectTaskView } from './SelectTaskView';
import { ServiceContainer } from './ServiceContainer';
import { TaskSelectItem } from './TaskSelectItem';
import { TaskCompleteItems } from './TaskCompleteItems';
import { TaskCompletePromptHandledEvent } from './TaskCompletePromptHandledEvent';
import { TaskCompletePromptHandledResponse } from './TaskCompletePromptHandledResponse';
import { TaskTimerEndItems } from './TaskTimerEndItems';
import { TaskTimerEndPromptHandledEvent } from './TaskTimerEndPromptHandledEvent';
import { TaskTimerEndPromptHandledResponse } from './TaskTimerEndPromptHandledResponse';
import { Unsubscribe } from './Unsubscribe';

export type Service = {
  AuthView?: Component;
  ConfigureView?: Component;
  Container?: ServiceContainer;
  CustomSelectGroup?: CustomSelectGroupComponent;
  CustomSelectOption?: CustomSelectOptionComponent;
  displayName: string;
  fetchTasks(): Promise<TaskSelectItem[]>;
  getSelectTaskHeading?(): string;
  getTaskCompleteItems?(params: GetTaskCompleteItemsParams): TaskCompleteItems | void;
  getTaskHeading?(): string;
  getTaskLabel?(taskId: string): string;
  getTaskTimerEndItems?(currentTaskId: string): TaskTimerEndItems;
  getTrackingEventServiceData?(currentTaskId: string): GetTrackingEventServiceDataResponse;
  handleError?: ErrorHandler;
  id: string;
  InitializingView?: InitializingView;
  onMount?(): Unsubscribe | undefined;
  onNoteCreate?: OnNoteCreate;
  onTaskCompletePromptHandled?(
    event: TaskCompletePromptHandledEvent
  ): TaskCompletePromptHandledResponse | void;
  onTaskCreate?: OnTaskCreate;
  onTaskOpen?(event: OnTaskOpenEvent): void;
  onTaskSelect?(taskId: string): boolean | void;
  onTaskTimerEndPromptHandled?(
    event: TaskTimerEndPromptHandledEvent
  ): TaskTimerEndPromptHandledResponse | void;
  pomelloEventListeners?: PomelloEventListeners;
  SelectTaskView?: SelectTaskView;
};
