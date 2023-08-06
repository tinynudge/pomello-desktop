import type { PomelloService, PomelloState } from '@tinynudge/pomello-service';
import { getContext, setContext } from 'svelte';
import { writable, type Writable } from 'svelte/store';

const pomelloStateContext = 'pomelloState';

const setPomelloStateContext = (pomelloService: PomelloService) => {
  const pomelloState = writable<PomelloState>(pomelloService.getState(), set => {
    const updatePomelloState = (state: PomelloState) => {
      set(state);
    };

    pomelloService.on('update', updatePomelloState);

    return () => {
      pomelloService.off('update', updatePomelloState);
    };
  });

  setContext(pomelloStateContext, pomelloState);
};

const getPomelloStateContext = (): Writable<PomelloState> => {
  return getContext(pomelloStateContext);
};

export { getPomelloStateContext, setPomelloStateContext };
