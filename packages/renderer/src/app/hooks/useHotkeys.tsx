import { useContext } from 'react';
import { HotkeysContext } from '../context/HotkeysContext';

const useHotkeys = () => {
  const context = useContext(HotkeysContext);

  if (!context) {
    throw new Error(`useHotkeys must be used inside <HotkeysProvider>`);
  }

  return context;
};

export default useHotkeys;
