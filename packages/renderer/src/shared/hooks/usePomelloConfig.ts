import { PomelloServiceConfig } from '@domain';
import { useContext, useSyncExternalStore } from 'react';
import { PomelloConfigContext } from '../context/PomelloConfigContext';
import assertNonNullish from '../helpers/assertNonNullish';

type Selector<TValue> = (config: PomelloServiceConfig) => TValue;

type SetPomelloConfig = <TKey extends keyof PomelloServiceConfig = keyof PomelloServiceConfig>(
  key: TKey,
  value: PomelloServiceConfig[TKey]
) => void;

type UnsetPomelloConfig = (key: keyof PomelloServiceConfig) => void;

export const usePomelloConfigSelector = <TValue>(selector: Selector<TValue>): TValue => {
  const pomelloConfig = useContext(PomelloConfigContext);

  assertNonNullish(
    pomelloConfig,
    'usePomelloConfigSelector must be used inside a <PomelloConfigProvider>'
  );

  return useSyncExternalStore(pomelloConfig.onChange, () => selector(pomelloConfig.get()));
};

export const usePomelloConfigUpdater = (): [SetPomelloConfig, UnsetPomelloConfig] => {
  const pomelloConfig = useContext(PomelloConfigContext);

  assertNonNullish(
    pomelloConfig,
    'usePomelloConfigUpdater must be used inside a <PomelloConfigProvider>'
  );

  return [pomelloConfig.set, pomelloConfig.unset];
};
