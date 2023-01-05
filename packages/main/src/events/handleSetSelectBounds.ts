import sanitizeBounds from '@/helpers/sanitizeBounds';
import runtime from '@/runtime';
import { SetSelectBoundsOptions } from '@domain';
import { IpcMainInvokeEvent } from 'electron';

const handleSetSelectBounds = (
  _event: IpcMainInvokeEvent,
  { bounds, orientation }: SetSelectBoundsOptions
): void => {
  const selectWindow = runtime.windowManager.findOrFailWindow('select');
  const newBounds = bounds;

  // We don't adjust the width if the select window is already open for a better
  // user experience.
  if (newBounds.width && selectWindow.isVisible()) {
    delete newBounds.width;
  }

  if (orientation === 'bottom' && newBounds.height) {
    const { height: currentHeight, y: currentY } = selectWindow.getBounds();

    if (!newBounds.y) {
      newBounds.y = currentY;
    }

    newBounds.y += currentHeight - newBounds.height;
  }

  selectWindow.setBounds(sanitizeBounds(newBounds));
};

export default handleSetSelectBounds;
