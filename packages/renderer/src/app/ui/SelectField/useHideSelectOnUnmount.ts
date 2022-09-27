import { useEffect } from 'react';

const useHideSelectOnUnmount = () => {
  useEffect(() => {
    return () => {
      window.app.hideSelect();
    };
  }, []);
};

export default useHideSelectOnUnmount;
