import { PomelloApi } from '@domain';
import { useContext } from 'react';
import { PomelloApiContext } from '../context/PomelloApiContext';
import assertNonNullish from '../helpers/assertNonNullish';

const usePomelloApi = (): PomelloApi => {
  const pomelloApi = useContext(PomelloApiContext);

  assertNonNullish(pomelloApi, 'usePomelloApi must be used inside a <PomelloApiProvider>');

  return pomelloApi;
};

export default usePomelloApi;
