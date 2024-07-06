import { runtime } from '@/runtime';
import { WindowId } from '@pomello-desktop/domain';
import { screen } from 'electron';

export const snapAppWindowToDisplayEdge = (): void => {
  const appWindow = runtime.windowManager.findOrFailWindow(WindowId.App);

  if (appWindow.isMaximized() || appWindow.isMinimized()) {
    return;
  }

  const tolerance = 15;

  const appBounds = appWindow.getBounds();
  const { bounds: displayBounds } = screen.getDisplayMatching(appBounds);

  let { x, y } = appBounds;

  if (displayBounds.x + tolerance >= appBounds.x) {
    x = displayBounds.x;
  } else if (displayBounds.x + displayBounds.width - tolerance <= appBounds.x + appBounds.width) {
    x = displayBounds.x + displayBounds.width - appBounds.width;
  }

  if (displayBounds.y + tolerance >= appBounds.y) {
    y = displayBounds.y;
  } else if (displayBounds.y + displayBounds.height - tolerance <= appBounds.y + appBounds.height) {
    y = displayBounds.y + displayBounds.height - appBounds.height;
  }

  if (x !== appBounds.x || y !== appBounds.y) {
    appWindow.setPosition(x, y);
  }
};
