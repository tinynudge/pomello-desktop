import { useEffect, useMemo, useRef, useState } from 'react';

type UseStore<TStore> = <TValue>(
  selector: Selector<TStore, TValue>,
  equalityFunction?: EqualityFunction<TValue>
) => TValue;

type UseStoreActions<TActions extends Actions> = {
  [Type in keyof TActions]: Action<TActions[Type]>;
};

type Selector<TStore, TValue> = (store: TStore) => TValue;

type EqualityFunction<TValue> = (a: TValue, b: TValue) => boolean;

type Actions = Record<string, (...args: any[]) => void>;

type Action<TAction> = TAction extends (...args: infer TArguments) => void
  ? (...args: TArguments) => void
  : never;

export default function useStore<TStore>(
  getStore: () => TStore,
  subscribe: (subscriber: (store: TStore) => void) => () => void
): UseStore<TStore>;

export default function useStore<TStore, TActions extends Actions>(
  getStore: () => TStore,
  subscribe: (subscriber: (store: TStore) => void) => () => void,
  actions: TActions
): UseStore<TStore> & UseStoreActions<TActions>;

export default function useStore<TStore = unknown, TActions extends Actions = never>(
  getStore: () => TStore,
  subscribe: (subscriber: (store: TStore) => void) => () => void,
  actions?: TActions
) {
  const actionsRef = useRef(actions);

  return useMemo(() => {
    const useStore = <TValue>(
      selector: Selector<TStore, TValue>,
      equalityFunction: EqualityFunction<TValue> = Object.is
    ) => {
      const [value, setValue] = useState(selector(getStore()));

      useEffect(() => {
        return subscribe(store => {
          setValue(previousValue => {
            const newValue = selector(store);
            const isSameValue = equalityFunction(previousValue, newValue);

            if (isSameValue) {
              return previousValue;
            }

            return newValue;
          });
        });
      }, [equalityFunction, selector]);

      return value;
    };

    if (actionsRef.current) {
      Object.entries(actionsRef.current).forEach(([type, action]) => {
        // @ts-ignore
        useStore[type] = action;
      });
    }

    return useStore;
  }, [getStore, subscribe]);
}
