import { useEffect, useRef } from 'react';

const useShowSelectOnMount = (shouldOpen: boolean, showSelect: () => void) => {
  const shouldOpenRef = useRef(shouldOpen);

  useEffect(() => {
    if (shouldOpenRef.current) {
      showSelect();
    }
  }, [showSelect]);
};

export default useShowSelectOnMount;
