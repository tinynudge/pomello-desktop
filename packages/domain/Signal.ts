import { SetSignal } from './SetSignal';
import { SignalSubscription } from './SignalSubscription';

export interface Signal<TValue = unknown> {
  get(): TValue;
  set(value: SetSignal<TValue>): void;
  subscribe(subscriber: SignalSubscription<TValue>): () => void;
}
