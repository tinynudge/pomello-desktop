import type { SetErrorOverlay } from '@domain';
import { getContext, setContext } from 'svelte';

const errorOverlayContext = 'errorOverlay';

const setErrorOverlayContext = (errorHandler: SetErrorOverlay) => {
  setContext(errorOverlayContext, errorHandler);
};

const getErrorOverlayContext = (): SetErrorOverlay => {
  return getContext(errorOverlayContext);
};

export { getErrorOverlayContext, setErrorOverlayContext };
