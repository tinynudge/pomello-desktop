import { sanitizeBounds } from '@/helpers/sanitizeBounds';
import { runtime } from '@/runtime';
import { AppEvent, ShowSelectMainOptions, WindowId } from '@pomello-desktop/domain';
import { IpcMainInvokeEvent, Rectangle, screen } from 'electron';

interface DisplayEdges {
  right: number;
  bottom: number;
}

const X_OFFSET = 6;
const Y_OFFSET = 16;

const getDisplayEdges = (appBounds: Rectangle): DisplayEdges => {
  const display = screen.getDisplayMatching(appBounds);

  const rightEdge = display.workArea.x + display.workArea.width;
  const bottomEdge = display.workArea.y + display.workArea.height;

  return {
    right: rightEdge,
    bottom: bottomEdge,
  };
};

export const handleShowSelect = async (
  _event: IpcMainInvokeEvent,
  options: ShowSelectMainOptions
): Promise<void> => {
  const appWindow = runtime.windowManager.findOrFailWindow(WindowId.App);
  const selectWindow = runtime.windowManager.findOrFailWindow(WindowId.Select);

  const appBounds = appWindow.getBounds();
  const selectBounds = selectWindow.getBounds();

  const bounds: Rectangle = {
    height: selectBounds.height,
    width: selectBounds.width,
    x: appBounds.x + options.buttonBounds.x - X_OFFSET,
    y: appBounds.y + options.buttonBounds.y - Y_OFFSET,
  };

  if (selectBounds.width <= appBounds.width) {
    bounds.width = appBounds.width;
  } else if (selectBounds.width > 500) {
    bounds.width = 500;
  }

  const displayEdges = getDisplayEdges(appBounds);

  const selectRightEdge = bounds.x + bounds.width;
  if (selectRightEdge > displayEdges.right) {
    // Align to the edge of the screen
    bounds.x = displayEdges.right - bounds.width;
  }

  const selectBottomEdge = bounds.y + bounds.height;
  const exceedsBottomEdge = selectBottomEdge > displayEdges.bottom;
  if (exceedsBottomEdge) {
    // Align from the bottom of the select button
    bounds.y =
      appBounds.y -
      selectBounds.height +
      options.buttonBounds.y +
      options.buttonBounds.height +
      Y_OFFSET / 2;
  }

  selectWindow.setBounds(sanitizeBounds(bounds));

  selectWindow.webContents.send(AppEvent.ShowSelect, {
    orientation: exceedsBottomEdge ? 'bottom' : 'top',
  });

  selectWindow.show();
};
