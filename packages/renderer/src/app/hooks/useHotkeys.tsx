import assertNonNullish from '@/shared/helpers/assertNonNullish';
import { useContext } from 'react';
import { HotkeysContext } from '../context/HotkeysContext';

const useHotkeys = () => {
  const context = useContext(HotkeysContext);

  assertNonNullish(context, 'useHotkeys must be used inside <HotkeysProvider>');

  return context;
};

export default useHotkeys;
