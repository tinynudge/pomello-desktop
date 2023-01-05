import { useEffect } from 'react';

const useShowSelectOnMount = (shouldOpen: boolean, showSelect: () => void) => {
  useEffect(() => {
    return window.app.onSelectReady(() => {
      if (shouldOpen) {
        showSelect();
      }
    });
  }, [shouldOpen, showSelect]);
};

export default useShowSelectOnMount;
