import { AppEvent } from '@domain';
import windowManager from './windowManager';

const hideSelectWindow = () => {
  const selectWindow = windowManager.findOrFailWindow('select');

  selectWindow.hide();

  selectWindow.webContents.send(AppEvent.HideSelect);
};

export default hideSelectWindow;
