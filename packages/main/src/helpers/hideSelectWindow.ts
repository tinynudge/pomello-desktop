import { AppEvent } from '@domain';
import windowManager from './windowManager';

const hideSelectWindow = async (isReset?: boolean) => {
  const selectWindow = windowManager.findOrFailWindow('select');

  selectWindow.webContents.send(AppEvent.HideSelect);

  setTimeout(() => {
    selectWindow.hide();

    if (isReset) {
      selectWindow.webContents.send(AppEvent.ResetSelect);
    }
  }, 5);
};

export default hideSelectWindow;
