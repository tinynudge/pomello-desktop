const findFirstOption = (container: HTMLElement | null): Element | null => {
  return container?.querySelector('[role=option]') ?? null;
};

export default findFirstOption;
