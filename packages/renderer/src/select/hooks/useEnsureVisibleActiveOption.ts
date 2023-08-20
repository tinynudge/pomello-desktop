import { SelectItem, Signal } from '@domain';
import { MutableRefObject, RefObject, useCallback, useEffect } from 'react';
import findFirstOption from '../helpers/findFirstOption';

interface UseEnsureVisibleActiveOptionOptions {
  activeOptionId: Signal<string | undefined>;
  inputHeight: MutableRefObject<number>;
  items: SelectItem[];
  listRef: RefObject<HTMLUListElement>;
}

const scrollBy = (top: number) => {
  // "auto" is supposed to work here since "instant" is deprecated, but for some
  // reason the default "auto" is still smooth scrolling.
  window.scrollBy({
    left: 0,
    top,
    behavior: 'instant',
  } as unknown as ScrollToOptions);
};

const useEnsureVisibleActiveOption = ({
  activeOptionId,
  inputHeight,
  items,
  listRef,
}: UseEnsureVisibleActiveOptionOptions): void => {
  const ensureVisibleOption = useCallback(
    (optionId?: string) => {
      let option: Element | null = null;

      if (optionId) {
        option = document.getElementById(optionId);
      }

      // The current active option may be gone after filtering so we'll just find
      // the first available option.
      if (!option) {
        const firstOption = findFirstOption(listRef.current);

        activeOptionId.set(firstOption?.id ?? undefined);

        option = firstOption;
      }

      if (option) {
        const { bottom, top } = option.getBoundingClientRect();

        if (top < inputHeight.current) {
          scrollBy(top - inputHeight.current);
        } else if (bottom > window.innerHeight) {
          scrollBy(bottom - window.innerHeight);
        }
      }
    },
    [activeOptionId, inputHeight, listRef]
  );

  useEffect(
    () => activeOptionId.subscribe(ensureVisibleOption),
    [activeOptionId, ensureVisibleOption, items]
  );
};

export default useEnsureVisibleActiveOption;
