import { PomelloApi } from '@pomello-desktop/domain';
import { ParentComponent, createContext, useContext } from 'solid-js';
import { assertNonNullish } from '../helpers/assertNonNullish';

type PomelloApiProviderProps = {
  initialPomelloApi: PomelloApi;
};

const PomelloApiContext = createContext<PomelloApi | undefined>(undefined);

export const usePomelloApi = (): PomelloApi => {
  const pomelloApi = useContext(PomelloApiContext);

  assertNonNullish(pomelloApi, 'usePomelloApi must be used inside a <PomelloApiProvider>');

  return pomelloApi;
};

export const PomelloApiProvider: ParentComponent<PomelloApiProviderProps> = props => {
  return (
    <PomelloApiContext.Provider value={props.initialPomelloApi}>
      {props.children}
    </PomelloApiContext.Provider>
  );
};
