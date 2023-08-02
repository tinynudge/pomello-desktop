import type { Rectangle } from 'electron';
import { tick } from 'svelte';

interface UpdateWindowDimensionsParams {
  container?: HTMLElement;
  maxRows: number;
  orientation?: 'bottom' | 'top';
  shouldUpdateWidth: boolean;
}

const actualWidthClassName = 'actual-width';

const updateWindowDimensions = async ({
  container,
  maxRows,
  orientation,
  shouldUpdateWidth,
}: UpdateWindowDimensionsParams): Promise<void> => {
  if (!container) {
    return;
  }

  await tick();

  const bounds: Partial<Rectangle> = {};

  if (shouldUpdateWidth) {
    container.classList.add(actualWidthClassName);

    bounds.width = container.getBoundingClientRect().width + 1;

    container.classList.remove(actualWidthClassName);
  }

  const rows = container.querySelectorAll('[data-row]');

  if (rows.length) {
    const option = rows.length > maxRows ? rows[maxRows - 1] : rows[rows.length - 1];

    bounds.height = window.scrollY + option.getBoundingClientRect().bottom;
  }

  window.app.setSelectBounds({ bounds, orientation });
};

export default updateWindowDimensions;
