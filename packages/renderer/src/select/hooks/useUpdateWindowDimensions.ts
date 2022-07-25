import { SelectItem } from '@domain';
import { Rectangle } from 'electron';
import { useEffect, useLayoutEffect, useRef } from 'react';

interface UseUpdateWindowDimensionsOptions {
  container: HTMLElement | null;
  items: SelectItem[];
  maxRows: number;
}

const useUpdateWindowDimensions = ({
  container,
  items,
  maxRows,
}: UseUpdateWindowDimensionsOptions): void => {
  const didSetWidth = useRef(false);

  useEffect(() => {
    return window.app.onSelectShow(() => {
      didSetWidth.current = false;
    });
  }, []);

  useLayoutEffect(() => {
    if (!container) {
      return;
    }

    const bounds: Partial<Rectangle> = {};

    if (!didSetWidth.current) {
      const originalDisplayProperty = container.style.display;

      // Force the container to "inline-block" so we can get the actual width of
      // of the content.
      container.style.display = 'inline-block';

      bounds.width = container.getBoundingClientRect().width + 1;

      container.style.display = originalDisplayProperty;
      didSetWidth.current = true;
    }

    const rows = container.querySelectorAll('[data-row]');

    if (rows.length) {
      const option = rows.length > maxRows ? rows[maxRows - 1] : rows[rows.length - 1];

      bounds.height = option.getBoundingClientRect().bottom;
    }

    window.app.setSelectBounds(bounds);
  }, [container, maxRows, items]);
};

export default useUpdateWindowDimensions;
