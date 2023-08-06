import findFirstOption from './findFirstOption';

interface EnsureVisibleActiveOptionOptions {
  activeOptionId?: string;
  inputHeight: number;
  listElement?: HTMLDivElement;
  updateActiveOption(optionId?: string): void;
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

const ensureActiveOptionVisible = ({
  activeOptionId,
  inputHeight,
  listElement,
  updateActiveOption,
}: EnsureVisibleActiveOptionOptions): void => {
  let option: Element | undefined = undefined;

  if (activeOptionId) {
    option = document.getElementById(activeOptionId) ?? undefined;
  }

  // The current active option may be gone after filtering so we'll just find
  // the first available option.
  if (!option) {
    const firstOption = findFirstOption(listElement);

    updateActiveOption(firstOption?.id);

    option = firstOption;
  }

  if (option) {
    const { bottom, top } = option.getBoundingClientRect();

    if (top < inputHeight) {
      scrollBy(top - inputHeight);
    } else if (bottom > window.innerHeight) {
      scrollBy(bottom - window.innerHeight);
    }
  }
};

export default ensureActiveOptionVisible;
