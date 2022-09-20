import assertNonNullish from '@/shared/helpers/assertNonNullish';
import { useContext } from 'react';
import { PomelloContext } from '../context/PomelloContext';

const usePomelloActions = () => {
  const context = useContext(PomelloContext);

  assertNonNullish(context, 'usePomelloActions must be used inside <PomelloProvider>');

  const { getState, on, off, ...actions } = context;

  return actions;
};

export default usePomelloActions;
