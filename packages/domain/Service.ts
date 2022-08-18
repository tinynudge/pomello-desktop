import { TaskTimerEndPromptHandledAction } from '@tinynudge/pomello-service';
import { AddNoteHandler } from './AddNoteHandler';
import { CustomSelectGroupComponent } from './CustomSelectGroupComponent';
import { CustomSelectOptionComponent } from './CustomSelectOptionComponent';
import { InitializingView } from './InitializingView';
import { SelectItem } from './SelectItem';
import { SelectOptionType } from './SelectOptionType';

export interface Service {
  CustomSelectGroup?: CustomSelectGroupComponent;
  CustomSelectOption?: CustomSelectOptionComponent;
  displayName: string;
  fetchTasks(): Promise<SelectItem[]>;
  getCompleteTaskOptions?(taskId: string): SelectItem[] | void;
  getTaskHeading?(): string;
  getTaskLabel?(task: SelectOptionType): string;
  getTaskTimerEndOptions?(): SelectItem[];
  handleNoteAdd?: AddNoteHandler;
  id: string;
  InitializingView: InitializingView;
  onMount?(): void;
  onTaskCompletePromptHandled?(taskId: string, action: string): void;
  onTaskTimerEndPromptHandled?(
    task: SelectOptionType,
    action: string
  ): TaskTimerEndPromptHandledAction | void;
  onUnmount?(): void;
}
