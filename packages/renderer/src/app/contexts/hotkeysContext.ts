import type { LabeledHotkeys } from '@domain';
import { getContext, setContext } from 'svelte';

const hotkeysContext = 'hotkeys';

const setHotkeysContext = (hotkeys: LabeledHotkeys) => {
  setContext(hotkeysContext, hotkeys);
};

const getHotkeysContext = (): LabeledHotkeys => {
  return getContext(hotkeysContext);
};

export { getHotkeysContext, setHotkeysContext };
