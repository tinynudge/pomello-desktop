import { useContext } from 'react';
import { AuthViewContext } from '../context/AuthViewProvider';

const useAuthView = () => {
  const context = useContext(AuthViewContext);

  if (!context) {
    throw new Error(`useAuthView must be used inside <AuthViewProvider>`);
  }

  return context;
};

export default useAuthView;
