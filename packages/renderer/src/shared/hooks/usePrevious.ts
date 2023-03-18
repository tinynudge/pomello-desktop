import { useEffect, useRef } from 'react';

const usePrevious = <TValue = unknown>(value: TValue) => {
  const ref = useRef<TValue>();

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
};

export default usePrevious;
