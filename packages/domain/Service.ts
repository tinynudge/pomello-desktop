import { CustomSelectGroupComponent } from './CustomSelectGroupComponent';
import { CustomSelectOptionComponent } from './CustomSelectOptionComponent';
import { CustomTaskTimerEndOption } from './CustomTaskTimerEndOption';
import { InitializingView } from './InitializingView';
import { SelectItem } from './SelectItem';
import { SelectOptionType } from './SelectOptionType';
import { TaskTimerEndActionType } from './TaskTimerEndActionType';

export interface Service {
  CustomSelectGroup?: CustomSelectGroupComponent;
  CustomSelectOption?: CustomSelectOptionComponent;
  fetchTasks(): Promise<SelectItem[]>;
  getTaskHeading?(): string;
  getTaskLabel?(task: SelectOptionType): string;
  getTaskTimerEndOptions?(): CustomTaskTimerEndOption[];
  id: string;
  InitializingView: InitializingView;
  onMount?(): void;
  onTaskTimerEndPromptHandled?(taskId: string, action: TaskTimerEndActionType): void;
  onUnmount?(): void;
}
