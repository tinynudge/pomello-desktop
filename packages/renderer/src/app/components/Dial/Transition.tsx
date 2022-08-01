import { FC, ReactNode, useEffect, useState } from 'react';

type VisibilityState = 'entering' | 'entered' | 'exiting' | 'exited';

type OnTransitionEnd = () => void;

interface TransitionProps {
  children: (state: VisibilityState, onTransitionEnd: OnTransitionEnd) => ReactNode;
  isVisible: boolean;
}

const Transition: FC<TransitionProps> = ({ children, isVisible }) => {
  const [visibilityState, setVisibilityState] = useState<VisibilityState>(
    isVisible ? 'entering' : 'exited'
  );
  console.log('🚀 ~ file: Transition.tsx ~ line 16 ~ visibilityState', visibilityState);

  useEffect(() => {
    setVisibilityState(previousVisibilityState => {
      if (previousVisibilityState === 'exited' && isVisible) {
        return 'entering';
      }

      if (previousVisibilityState === 'entered' && !isVisible) {
        return 'exiting';
      }

      return previousVisibilityState;
    });
  }, [isVisible]);

  const handleTransitionEnd = () => {
    setVisibilityState(previousVisibilityState =>
      previousVisibilityState === 'entering' ? 'entered' : 'exited'
    );
  };

  // if (visibilityState === 'exited') {
  //   return null;
  // }

  return <>{children(visibilityState, handleTransitionEnd)}</>;
};

export default Transition;
