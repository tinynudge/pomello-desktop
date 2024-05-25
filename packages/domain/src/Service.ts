import { PomelloEvent } from '@tinynudge/pomello-service';
import { Component } from 'solid-js';
import { AdditionalTrackingData } from './AdditionalTrackingData';
import { CustomSelectGroupComponent } from './CustomSelectGroupComponent';
import { CustomSelectOptionComponent } from './CustomSelectOptionComponent';
import { ErrorHandler } from './ErrorHandler';
import { GetTaskCompleteItemsParams } from './GetTaskCompleteItemsParams';
import { InitializingView } from './InitializingView';
import { OnNoteCreate } from './OnNoteCreate';
import { OnTaskCreate } from './OnTaskCreate';
import { OnTaskOpenEvent } from './OnTaskOpenEvent';
import { PomelloEventListeners } from './PomelloEventListeners';
import { SelectItem } from './SelectItem';
import { SelectTaskView } from './SelectTaskView';
import { ServiceContainer } from './ServiceContainer';
import { TaskCompleteItems } from './TaskCompleteItems';
import { TaskCompletePromptHandledEvent } from './TaskCompletePromptHandledEvent';
import { TaskCompletePromptHandledResponse } from './TaskCompletePromptHandledResponse';
import { TaskTimerEndItems } from './TaskTimerEndItems';
import { TaskTimerEndPromptHandledEvent } from './TaskTimerEndPromptHandledEvent';
import { TaskTimerEndPromptHandledResponse } from './TaskTimerEndPromptHandledResponse';
import { Unsubscribe } from './Unsubscribe';

export type Service = {
  AuthView?: Component;
  Container?: ServiceContainer;
  CustomSelectGroup?: CustomSelectGroupComponent;
  CustomSelectOption?: CustomSelectOptionComponent;
  displayName: string;
  fetchTasks(): Promise<SelectItem[]>;
  getAdditionalTrackingData?(event: PomelloEvent): AdditionalTrackingData | void;
  getSelectTaskHeading?(): string;
  getTaskCompleteItems?(params: GetTaskCompleteItemsParams): TaskCompleteItems | void;
  getTaskHeading?(): string;
  getTaskLabel?(taskId: string): string;
  getTaskTimerEndItems?(currentTaskId: string): TaskTimerEndItems;
  handleError?: ErrorHandler;
  id: string;
  InitializingView?: InitializingView;
  onMount?(): Unsubscribe | undefined;
  onNoteCreate?: OnNoteCreate;
  onTaskCompletePromptHandled?(
    event: TaskCompletePromptHandledEvent
  ): TaskCompletePromptHandledResponse;
  onTaskCreate?: OnTaskCreate;
  onTaskOpen?(event: OnTaskOpenEvent): void;
  onTaskSelect?(taskId: string): boolean | void;
  onTaskTimerEndPromptHandled?(
    event: TaskTimerEndPromptHandledEvent
  ): TaskTimerEndPromptHandledResponse;
  pomelloEventListeners?: PomelloEventListeners;
  SelectTaskView?: SelectTaskView;
};
