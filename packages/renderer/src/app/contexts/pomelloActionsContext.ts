import type { PomelloService } from '@tinynudge/pomello-service';
import { getContext, setContext } from 'svelte';

type PomelloActions = Omit<PomelloService, 'getState' | 'on' | 'off'>;

const pomelloActionsContext = 'pomelloActions';

const setPomelloActionsContext = (pomelloService: PomelloService) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { getState, on, off, ...actions } = pomelloService;

  setContext(pomelloActionsContext, actions);
};

const getPomelloActionsContext = (): PomelloActions => {
  return getContext(pomelloActionsContext);
};

export { getPomelloActionsContext, setPomelloActionsContext };
