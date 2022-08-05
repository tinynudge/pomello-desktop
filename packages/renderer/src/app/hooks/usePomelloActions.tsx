import { useContext } from 'react';
import { PomelloContext } from '../context/PomelloContext';

const usePomelloActions = () => {
  const context = useContext(PomelloContext);

  if (!context) {
    throw new Error(`usePomelloActions must be used inside <PomelloProvider>`);
  }

  const { getState, on, off, ...actions } = context;

  return actions;
};

export default usePomelloActions;
