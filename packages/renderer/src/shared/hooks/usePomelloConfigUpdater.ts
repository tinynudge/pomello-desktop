import { useContext } from 'react';
import { PomelloConfigContext } from '../context/PomelloConfigContext';
import assertNonNullish from '../helpers/assertNonNullish';

const usePomelloConfigUpdater = () => {
  const pomelloConfig = useContext(PomelloConfigContext);

  assertNonNullish(
    pomelloConfig,
    'usePomelloConfigUpdater must be used inside a <PomelloConfigProvider>'
  );

  return [pomelloConfig.set, pomelloConfig.unset];
};

export default usePomelloConfigUpdater;
