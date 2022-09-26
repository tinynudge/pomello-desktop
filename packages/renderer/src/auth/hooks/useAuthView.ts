import assertNonNullish from '@/shared/helpers/assertNonNullish';
import { useContext } from 'react';
import { AuthViewContext } from '../context/AuthViewProvider';

const useAuthView = () => {
  const context = useContext(AuthViewContext);

  assertNonNullish(context, 'useAuthView must be used inside <AuthViewProvider>');

  return context;
};

export default useAuthView;
