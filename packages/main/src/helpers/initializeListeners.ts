import handleGetSettings from '@/events/handleGetSettings';
import handleGetThemeCss from '@/events/handleGetThemeCss';
import handleGetTranslations from '@/events/handleGetTranslations';
import handleRegisterServiceConfig from '@/events/handleRegisterServiceConfig';
import handleShowMessageBox from '@/events/handleShowMessageBox';
import handleThemeUpdate from '@/events/handleThemeUpdate';
import { AppEvent } from '@domain';
import { ipcMain, nativeTheme } from 'electron';

const initializeListeners = (): void => {
  ipcMain.handle(AppEvent.GetSettings, handleGetSettings);
  ipcMain.handle(AppEvent.GetThemeCss, handleGetThemeCss);
  ipcMain.handle(AppEvent.GetTranslations, handleGetTranslations);
  ipcMain.handle(AppEvent.RegisterServiceConfig, handleRegisterServiceConfig);
  ipcMain.handle(AppEvent.ShowMessageBox, handleShowMessageBox);

  nativeTheme.on('updated', handleThemeUpdate);
};

export default initializeListeners;
