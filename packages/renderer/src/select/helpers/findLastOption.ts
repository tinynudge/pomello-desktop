const findLastOption = (container: HTMLElement | null): Element | null => {
  const options = container?.querySelectorAll('[role=option]');

  if (!options) {
    return null;
  }

  return options[options.length - 1];
};

export default findLastOption;
