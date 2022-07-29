import runtime from '@/runtime';
import { AppEvent } from '@domain';

const hideSelectWindow = () => {
  const selectWindow = runtime.windowManager.findOrFailWindow('select');

  selectWindow.hide();

  selectWindow.webContents.send(AppEvent.HideSelect);
};

export default hideSelectWindow;
