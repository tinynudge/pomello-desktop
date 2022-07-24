interface FindNearestOptionOptions {
  activeOptionId?: string;
  container: HTMLElement | null;
  direction: 'next' | 'previous';
}

interface ParseElementOptions {
  direction: 'next' | 'previous';
  element?: Element | null;
  parentElement?: Element | null;
}

const parseElement = ({
  direction,
  element = null,
  parentElement = element?.parentElement,
}: ParseElementOptions): Element | null => {
  if (!element) {
    if (parentElement?.getAttribute('role') === 'group') {
      const adjacentContainer = parentElement[`${direction}ElementSibling`];

      // If the group has a sibling, start looking there
      if (adjacentContainer) {
        return parseElement({ direction, element: adjacentContainer });
      }

      // Otherwise we go up another level
      return parseElement({
        direction,
        element: null,
        parentElement: parentElement.parentElement,
      });
    }

    return null;
  }

  if (element.getAttribute('role') === 'option') {
    return element;
  }

  if (element.getAttribute('role') === 'group') {
    const start = direction === 'next' ? 'first' : 'last';

    return parseElement({
      direction,
      element: element[`${start}ElementChild`],
    });
  }

  return parseElement({
    direction,
    element: element[`${direction}ElementSibling`],
    parentElement: parentElement,
  });
};

const findNearestOption = ({ activeOptionId, container, direction }: FindNearestOptionOptions) => {
  const start = direction === 'next' ? 'first' : 'last';

  let element: Element | null | undefined = container?.[`${start}ElementChild`];
  let parentElement: Element | null | undefined = container;

  if (activeOptionId) {
    const activeOption = document.getElementById(activeOptionId);

    element = activeOption?.[`${direction}ElementSibling`];
    parentElement = activeOption?.parentElement;
  }

  return parseElement({ direction, element, parentElement });
};

export default findNearestOption;
