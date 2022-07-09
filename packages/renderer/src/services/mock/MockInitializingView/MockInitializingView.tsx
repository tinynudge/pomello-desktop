import Heading from '@/app/ui/Heading';
import { InitializingView } from '@domain';
import { useEffect } from 'react';

const MockInitializingView: InitializingView = ({ onReady }) => {
  useEffect(() => {
    setTimeout(() => {
      onReady();
    }, 300);
  }, [onReady]);

  return (
    <>
      <Heading>Initializing...</Heading>
      Please wait...
    </>
  );
};

export default MockInitializingView;
