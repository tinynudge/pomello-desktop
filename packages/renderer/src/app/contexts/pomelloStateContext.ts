import type { PomelloService, PomelloState } from '@tinynudge/pomello-service';
import { getContext, setContext } from 'svelte';
import { derived, readable, type Readable } from 'svelte/store';

interface PomelloStateStore extends Readable<PomelloState> {
  getCurrentTaskId(): Readable<string | null>;
}

const pomelloStateContext = 'pomelloState';

const setPomelloStateContext = (pomelloService: PomelloService) => {
  const pomelloState = readable<PomelloState>(pomelloService.getState(), set => {
    const updatePomelloState = (state: PomelloState) => {
      set(state);
    };

    pomelloService.on('update', updatePomelloState);

    return () => {
      pomelloService.off('update', updatePomelloState);
    };
  });

  const getCurrentTaskId = () =>
    derived(pomelloState, $pomelloState => $pomelloState.currentTaskId);

  setContext<PomelloStateStore>(pomelloStateContext, {
    ...pomelloState,
    getCurrentTaskId,
  });
};

const getPomelloStateContext = (): PomelloStateStore => {
  return getContext(pomelloStateContext);
};

export { getPomelloStateContext, setPomelloStateContext };
