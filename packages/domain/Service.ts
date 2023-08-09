import type { CustomSelectGroupProps } from './CustomSelectGroupProps';
import type { CustomSelectOptionProps } from './CustomSelectOptionProps';
import type { InitializingViewProps } from './InitializingViewProps';
import type { View } from './View';

export interface Service {
  Container?: View;
  CustomSelectGroup?: View<CustomSelectGroupProps>;
  CustomSelectOption?: View<CustomSelectOptionProps>;
  displayName: string;
  id: string;
  InitializingView?: View<InitializingViewProps>;
  onMount?(): void;
  onUnmount?(): void;
}
