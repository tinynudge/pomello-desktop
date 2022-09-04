import { SelectItem } from '@domain';
import { MutableRefObject, RefObject, useCallback, useEffect } from 'react';
import findFirstOption from '../helpers/findFirstOption';

interface UseEnsureVisibleActiveOptionOptions {
  activeOptionId?: string;
  inputHeight: MutableRefObject<number>;
  items: SelectItem[];
  listRef: RefObject<HTMLUListElement>;
  setActiveOptionId(activeOptionId?: string): void;
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
  setActiveOptionId,
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

        setActiveOptionId(firstOption?.id ?? undefined);

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
    [inputHeight, listRef, setActiveOptionId]
  );

  useEffect(() => {
    ensureVisibleOption(activeOptionId);
  }, [activeOptionId, ensureVisibleOption, items]);
};

export default useEnsureVisibleActiveOption;
