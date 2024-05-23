import { getThemeCss } from '@/helpers/getThemeCss';
import { runtime } from '@/runtime';
import { AppEvent } from '@pomello-desktop/domain';

export const handleThemeUpdate = (): void => {
  const themeCss = getThemeCss();

  runtime.windowManager.getAllWindows().forEach(browserWindow => {
    browserWindow.webContents.send(AppEvent.ThemeCssChange, themeCss);
  });
};
