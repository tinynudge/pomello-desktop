import { useEffect } from 'react';

const useHideSelectOnUnmount = () => {
  useEffect(() => {
    return () => {
      window.app.resetSelect();
    };
  }, []);
};

export default useHideSelectOnUnmount;
