import type { SetSelectItemsOptions } from '@domain';
import { readable } from 'svelte/store';

const initialState: SetSelectItemsOptions = {
  items: [],
  noResultsMessage: undefined,
  placeholder: undefined,
};

const getSelectOptions = () => {
  return readable<SetSelectItemsOptions>(initialState, set => {
    const onSetSelectItemsUnsubscribe = window.app.onSetSelectItems(options => {
      set(options);

      if (options.placeholder) {
        // Update the title so screen readers have more context.
        document.title = options.placeholder;
      }
    });

    const onSelectResetUnsubscribe = window.app.onSelectReset(() => {
      set(initialState);
    });

    return () => {
      onSetSelectItemsUnsubscribe();
      onSelectResetUnsubscribe();
    };
  });
};

export default getSelectOptions;
