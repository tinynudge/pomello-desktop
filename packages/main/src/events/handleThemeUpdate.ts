import getThemeCss from '@/helpers/getThemeCss';
import windowManager from '@/helpers/windowManager';
import { AppEvent } from '@domain';

const handleThemeUpdate = (): void => {
  const themeCss = getThemeCss();

  windowManager.getAllWindows().forEach(browserWindow => {
    browserWindow.webContents.send(AppEvent.ThemeCssChange, themeCss);
  });
};

export default handleThemeUpdate;
