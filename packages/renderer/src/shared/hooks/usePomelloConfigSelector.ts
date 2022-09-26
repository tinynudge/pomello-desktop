import { PomelloServiceConfig } from '@domain';
import { useContext, useSyncExternalStore } from 'react';
import { PomelloConfigContext } from '../context/PomelloConfigContext';
import assertNonNullish from '../helpers/assertNonNullish';

type Selector<TValue> = (config: PomelloServiceConfig) => TValue;

const usePomelloConfigSelector = <TValue>(selector: Selector<TValue>): TValue => {
  const pomelloConfig = useContext(PomelloConfigContext);

  assertNonNullish(
    pomelloConfig,
    'usePomelloConfigSelector must be used inside a <PomelloConfigProvider>'
  );

  return useSyncExternalStore(pomelloConfig.onChange, () => selector(pomelloConfig.get()));
};

export default usePomelloConfigSelector;
