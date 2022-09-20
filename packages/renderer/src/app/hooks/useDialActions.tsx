import assertNonNullish from '@/shared/helpers/assertNonNullish';
import { useContext } from 'react';
import { DialActionsContext } from '../context/DialActionsContext';

const useDialActions = () => {
  const context = useContext(DialActionsContext);

  assertNonNullish(context, 'useDialActions must be used inside <DialActionsProvider>');

  return context;
};

export default useDialActions;
