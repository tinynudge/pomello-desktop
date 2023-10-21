import { PomelloEvent } from '@tinynudge/pomello-service';
import { FC } from 'react';
import { AdditionalTrackingData } from './AdditionalTrackingData';
import { CustomSelectGroupComponent } from './CustomSelectGroupComponent';
import { CustomSelectOptionComponent } from './CustomSelectOptionComponent';
import { ErrorHandler } from './ErrorHandler';
import { GetTaskCompleteItemsParams } from './GetTaskCompleteItemsParams';
import { GetTaskCompleteItemsResponse } from './GetTaskCompleteItemsResponse';
import { InitializingView } from './InitializingView';
import { OnNoteCreate } from './OnNoteCreate';
import { OnTaskCreate } from './OnTaskCreate';
import { OnTaskOpenEvent } from './OnTaskOpenEvent';
import { PomelloEventType } from './PomelloEventType';
import { SelectItem } from './SelectItem';
import { SelectTaskView } from './SelectTaskView';
import { ServiceContainer } from './ServiceContainer';
import { TaskCompletePromptHandledEvent } from './TaskCompletePromptHandledEvent';
import { TaskCompletePromptHandledResponse } from './TaskCompletePromptHandledResponse';
import { TaskTimerEndItems } from './TaskTimerEndItems';
import { TaskTimerEndPromptHandledEvent } from './TaskTimerEndPromptHandledEvent';
import { TaskTimerEndPromptHandledResponse } from './TaskTimerEndPromptHandledResponse';
import { Unsubscribe } from './Unsubscribe';

export interface Service {
  AuthView?: FC;
  Container?: ServiceContainer;
  CustomSelectGroup?: CustomSelectGroupComponent;
  CustomSelectOption?: CustomSelectOptionComponent;
  displayName: string;
  fetchTasks(): Promise<SelectItem[]>;
  getAdditionalTrackingData?(event: PomelloEvent): AdditionalTrackingData | void;
  getSelectTaskHeading?(): string;
  getTaskCompleteItems?(params: GetTaskCompleteItemsParams): GetTaskCompleteItemsResponse;
  getTaskHeading?(): string;
  getTaskLabel?(taskId: string): string;
  getTaskTimerEndItems?(currentTaskId: string): TaskTimerEndItems;
  getTrackingStatus?(): boolean;
  handleError?: ErrorHandler;
  id: string;
  InitializingView?: InitializingView;
  onMount?(): Unsubscribe | void;
  onNoteCreate?: OnNoteCreate;
  onPomelloEvent?(type: PomelloEventType, event: PomelloEvent): void;
  onTaskCompletePromptHandled?(
    event: TaskCompletePromptHandledEvent
  ): TaskCompletePromptHandledResponse;
  onTaskCreate?: OnTaskCreate;
  onTaskOpen?(event: OnTaskOpenEvent): void;
  onTaskSelect?(taskId: string): boolean | void;
  onTaskTimerEndPromptHandled?(
    event: TaskTimerEndPromptHandledEvent
  ): TaskTimerEndPromptHandledResponse;
  onUnmount?(): void;
  SelectTaskView?: SelectTaskView;
}
