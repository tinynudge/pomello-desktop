import type { InitializingViewProps } from './InitializingViewProps';
import type { ServiceContainer } from './ServiceContainer';
import type { View } from './View';

export interface Service {
  Container?: ServiceContainer;
  displayName: string;
  id: string;
  InitializingView?: View<InitializingViewProps>;
  onMount?(): void;
  onUnmount?(): void;
}
