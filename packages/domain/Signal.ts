import { SetSignal } from './SetSignal';
import { SignalSubscription } from './SignalSubscription';
import { Unsubscribe } from './Unsubscribe';

export interface Signal<TValue = unknown> {
  get(): TValue;
  set(value: SetSignal<TValue>): void;
  subscribe(subscriber: SignalSubscription<TValue>): Unsubscribe;
}
