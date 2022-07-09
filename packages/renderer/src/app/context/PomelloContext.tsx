import { pomelloStateUpdate } from '@/app/appSlice';
import { PomelloService, PomelloState } from '@tinynudge/pomello-service';
import { createContext, FC, ReactNode, useEffect } from 'react';
import { useDispatch } from 'react-redux';

interface PomelloContextProviderProps {
  children: ReactNode;
  service: PomelloService;
}

export const PomelloContext = createContext<PomelloService | undefined>(undefined);

export const PomelloContextProvider: FC<PomelloContextProviderProps> = ({ children, service }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const updatePomelloState = (state: PomelloState) => {
      dispatch(pomelloStateUpdate(state));
    };

    service.on('update', updatePomelloState);

    return () => {
      service.off('update', updatePomelloState);
    };
  }, [dispatch, service]);

  return <PomelloContext.Provider value={service}>{children}</PomelloContext.Provider>;
};
