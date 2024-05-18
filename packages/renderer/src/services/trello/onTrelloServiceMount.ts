import { createEffect, createRoot } from 'solid-js';
import { TrelloRuntime } from './domain';

export const onTrelloServiceMount = ({ cache, config }: TrelloRuntime) => {
  return createRoot(dispose => {
    createEffect(() => {
      const token = config.store.token;

      if (token) {
        const decryptedToken = window.app.decryptValue(token);

        if (decryptedToken) {
          cache.actions.tokenSet(decryptedToken);
        } else {
          config.actions.tokenUnset();
        }
      } else {
        cache.actions.tokenUnset();
      }
    });

    return dispose;
  });
};
