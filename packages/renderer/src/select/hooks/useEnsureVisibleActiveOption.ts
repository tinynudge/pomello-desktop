import { SelectItem } from '@pomello-desktop/domain';
import { Accessor, Setter, createEffect, on } from 'solid-js';
import { findFirstOption } from '../helpers/findOption';

interface UseEnsureVisibleActiveOptionOptions {
  getActiveOptionId: Accessor<string | undefined>;
  getInputRef(): HTMLInputElement;
  getItems: Accessor<SelectItem[]>;
  getListRef(): HTMLUListElement;
  setActiveOptionId: Setter<string | undefined>;
}

const scrollBy = (top: number): void => {
  // "auto" is supposed to work here since "instant" is deprecated, but for some
  // reason the default "auto" is still smooth scrolling.
  window.scrollBy({
    left: 0,
    top,
    behavior: 'instant',
  } as unknown as ScrollToOptions);
};

export const useEnsureVisibleActiveOption = ({
  getActiveOptionId,
  getInputRef,
  getItems,
  getListRef,
  setActiveOptionId,
}: UseEnsureVisibleActiveOptionOptions): void => {
  let inputHeight = 0;

  createEffect(
    on([getActiveOptionId, getItems], ([optionId]) => {
      queueMicrotask(() => {
        const option = optionId ? document.getElementById(optionId) : null;

        if (option) {
          const { bottom, top } = option.getBoundingClientRect();

          if (!inputHeight) {
            inputHeight = getInputRef().getBoundingClientRect().height;
          }

          if (top < inputHeight) {
            scrollBy(top - inputHeight);
          } else if (bottom > window.innerHeight) {
            scrollBy(bottom - window.innerHeight);
          }
        } else {
          const listRef = getListRef();
          const firstOption = findFirstOption(listRef);

          setActiveOptionId(firstOption?.id);
        }
      });
    })
  );
};
