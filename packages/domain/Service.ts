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
  getTaskHeading?(): string;
  getTaskLabel?(task: SelectOptionType): string;
  getTaskTimerEndOptions?(): SelectItem[];
  handleNoteAdd?: AddNoteHandler;
  id: string;
  InitializingView: InitializingView;
  onMount?(): void;
  onTaskTimerEndPromptHandled?(
    task: SelectOptionType,
    action: string
  ): TaskTimerEndPromptHandledAction | void;
  onUnmount?(): void;
}
