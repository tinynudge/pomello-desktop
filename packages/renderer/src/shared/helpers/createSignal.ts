import { SetSignal, SetSignalFunction, Signal, SignalSubscription } from '@domain';
import produce from 'immer';

function isSetSignalFunction<TValue>(value: SetSignal<TValue>): value is SetSignalFunction<TValue> {
  return typeof value === 'function';
}

export default function createSignal<TValue>(initialValue: TValue): Signal<TValue>;

export default function createSignal<TValue = undefined>(): Signal<TValue | undefined>;

export default function createSignal<TValue>(initialValue?: TValue) {
  type Value = TValue | undefined;

  let value: Value = initialValue;
  const subscribers = new Set<SignalSubscription<Value>>();

  const get = () => value;

  const set = (setStore: SetSignal<Value>) => {
    const newValue = isSetSignalFunction(setStore) ? produce(value, setStore) : setStore;

    if (newValue !== value) {
      value = newValue;
      subscribers.forEach(subscriber => subscriber(value));
    }
  };

  const subscribe = (subscriber: SignalSubscription<Value>) => {
    subscribers.add(subscriber);

    subscriber(value);

    return () => {
      subscribers.delete(subscriber);
    };
  };

  return { get, set, subscribe };
}
