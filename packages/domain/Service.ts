import type { CustomErrorHandler } from './CustomErrorHandler';
import type { CustomSelectGroupProps } from './CustomSelectGroupProps';
import type { CustomSelectOptionProps } from './CustomSelectOptionProps';
import type { InitializingViewProps } from './InitializingViewProps';
import type { SelectItem } from './SelectItem';
import type { SelectTaskViewProps } from './SelectTaskViewProps';
import type { View } from './View';

export interface Service {
  Container?: View;
  CustomSelectGroup?: View<CustomSelectGroupProps>;
  CustomSelectOption?: View<CustomSelectOptionProps>;
  displayName: string;
  fetchTasks(): Promise<SelectItem[]>;
  getSelectTaskHeading?(): string;
  handleError?: CustomErrorHandler;
  id: string;
  InitializingView?: View<InitializingViewProps>;
  onMount?(): void;
  onTaskSelect?(taskId: string): boolean | void;
  onUnmount?(): void;
  SelectTaskView?: View<SelectTaskViewProps>;
}
