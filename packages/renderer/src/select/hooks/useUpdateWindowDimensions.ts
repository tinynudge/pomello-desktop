import { SelectItem } from '@pomello-desktop/domain';
import { Rectangle } from 'electron';
import { Accessor, createEffect, on, onCleanup } from 'solid-js';

interface UseUpdateWindowDimensionsOptions {
  getContainer(): HTMLElement;
  getIsVisible: Accessor<boolean>;
  getItems: Accessor<SelectItem[]>;
  maxRows: number;
}

export const useUpdateWindowDimensions = ({
  getContainer,
  getIsVisible,
  getItems,
  maxRows,
}: UseUpdateWindowDimensionsOptions): void => {
  let windowOrientation: 'bottom' | 'top' | undefined;

  const removeOnShowSelect = window.app.onShowSelect(({ orientation }) => {
    windowOrientation = orientation;
  });

  onCleanup(() => {
    removeOnShowSelect();
  });

  createEffect(
    on(getItems, () => {
      const container = getContainer();
      const isVisible = getIsVisible();
      const bounds: Partial<Rectangle> = {};

      // To prevent a jarring experience, only update the width when hidden
      if (!isVisible) {
        const originalDisplayProperty = container.style.display;

        // Force the container to "inline-block" so we can get the actual width of
        // of the content.
        container.style.display = 'inline-block';

        bounds.width = container.getBoundingClientRect().width + 1;

        container.style.display = originalDisplayProperty;
      }

      const rows = container.querySelectorAll('[data-row]');

      if (rows.length) {
        const option = rows.length > maxRows ? rows[maxRows - 1] : rows[rows.length - 1];

        bounds.height = window.scrollY + option.getBoundingClientRect().bottom;
      }

      window.app.setSelectBounds({
        bounds,
        orientation: windowOrientation,
      });
    })
  );
};
