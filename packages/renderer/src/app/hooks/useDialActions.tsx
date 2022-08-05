import { useContext } from 'react';
import { DialActionsContext } from '../context/DialActionsContext';

const useDialActions = () => {
  const context = useContext(DialActionsContext);

  if (!context) {
    throw new Error(`useDialActions must be used inside <DialActionsProvider>`);
  }

  return context;
};

export default useDialActions;
