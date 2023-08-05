const findFirstOption = (container?: HTMLElement): Element | undefined => {
  return container?.querySelector('[role=option]') ?? undefined;
};

export default findFirstOption;
