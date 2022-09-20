import assertNonNullish from '@/shared/helpers/assertNonNullish';
import { PomelloService } from '@tinynudge/pomello-service';
import { useContext } from 'react';
import { PomelloContext } from '../context/PomelloContext';

const usePomelloService = (): PomelloService => {
  const context = useContext(PomelloContext);

  assertNonNullish(context, 'usePomelloService must be used inside <PomelloProvider>');

  return context;
};

export default usePomelloService;
