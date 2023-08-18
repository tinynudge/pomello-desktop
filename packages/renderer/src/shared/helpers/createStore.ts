export interface Store<TValue = unknown> {
  get(): TValue;
  set(value: TValue): void;
  subscribe(subscriber: StoreSubscriber<TValue>): () => void;
}

type StoreSubscriber<TValue = unknown> = (value: TValue) => void;

export default function createStore<TValue>(initialValue: TValue): Store<TValue>;

export default function createStore<TValue = undefined>(): Store<TValue | undefined>;

export default function createStore<TValue>(initialValue?: TValue) {
  let value: TValue | undefined = initialValue;
  const subscribers = new Set<StoreSubscriber<TValue>>();

  const get = () => value;

  const set = (newValue: TValue) => {
    if (newValue !== value) {
      value = newValue;
      subscribers.forEach(subscriber => subscriber(newValue));
    }
  };

  const subscribe = (subscriber: StoreSubscriber<TValue>) => {
    subscribers.add(subscriber);

    subscriber(value as TValue);

    return () => {
      subscribers.delete(subscriber);
    };
  };

  return { get, set, subscribe };
}
