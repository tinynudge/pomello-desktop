import { CustomSelectGroupComponent } from './CustomSelectGroupComponent';
import { CustomSelectOptionComponent } from './CustomSelectOptionComponent';
import { CustomTaskTimerEndOption } from './CustomTaskTimerEndOption';
import { InitializingView } from './InitializingView';
import { SelectItem } from './SelectItem';
import { TaskTimerEndActionType } from './TaskTimerEndActionType';

export interface Service {
  CustomSelectGroup?: CustomSelectGroupComponent;
  CustomSelectOption?: CustomSelectOptionComponent;
  fetchTasks(): Promise<SelectItem[]>;
  getTaskTimerEndOptions?(): CustomTaskTimerEndOption[];
  id: string;
  InitializingView: InitializingView;
  onMount?(): void;
  onTaskTimerEndPromptHandled?(taskId: string, action: TaskTimerEndActionType): void;
  onUnmount?(): void;
}
