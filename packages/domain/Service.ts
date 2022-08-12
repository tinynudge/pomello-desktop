import { CustomSelectGroupComponent } from './CustomSelectGroupComponent';
import { CustomSelectOptionComponent } from './CustomSelectOptionComponent';
import { CustomTaskTimerEndOption } from './CustomTaskTimerEndOption';
import { AddNoteHandler } from './AddNoteHandler';
import { InitializingView } from './InitializingView';
import { SelectItem } from './SelectItem';
import { SelectOptionType } from './SelectOptionType';
import { TaskTimerEndActionType } from './TaskTimerEndActionType';

export interface Service {
  CustomSelectGroup?: CustomSelectGroupComponent;
  CustomSelectOption?: CustomSelectOptionComponent;
  displayName: string;
  fetchTasks(): Promise<SelectItem[]>;
  getTaskHeading?(): string;
  getTaskLabel?(task: SelectOptionType): string;
  getTaskTimerEndOptions?(): CustomTaskTimerEndOption[];
  handleNoteAdd?: AddNoteHandler;
  id: string;
  InitializingView: InitializingView;
  onMount?(): void;
  onTaskTimerEndPromptHandled?(taskId: string, action: TaskTimerEndActionType): void;
  onUnmount?(): void;
}
