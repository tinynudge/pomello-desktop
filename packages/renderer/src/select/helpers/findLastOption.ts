const findLastOption = (container?: HTMLElement): Element | undefined => {
  const options = container?.querySelectorAll('[role=option]');

  if (!options) {
    return;
  }

  return options[options.length - 1];
};

export default findLastOption;
