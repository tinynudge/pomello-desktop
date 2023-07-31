import handleGetSettings from '@/events/handleGetSettings';
import handleGetThemeCss from '@/events/handleGetThemeCss';
import handleGetTranslations from '@/events/handleGetTranslations';
import handleOptionSelect from '@/events/handleOptionSelect';
import handleRegisterServiceConfig from '@/events/handleRegisterServiceConfig';
import handleResetSelect from '@/events/handleResetSelect';
import handleSetSelectItems from '@/events/handleSetSelectItems';
import handleShowMessageBox from '@/events/handleShowMessageBox';
import handleShowSelect from '@/events/handleShowSelect';
import handleThemeUpdate from '@/events/handleThemeUpdate';
import { AppEvent } from '@domain';
import { ipcMain, nativeTheme } from 'electron';

const initializeListeners = (): void => {
  ipcMain.handle(AppEvent.GetSettings, handleGetSettings);
  ipcMain.handle(AppEvent.GetThemeCss, handleGetThemeCss);
  ipcMain.handle(AppEvent.GetTranslations, handleGetTranslations);
  ipcMain.handle(AppEvent.RegisterServiceConfig, handleRegisterServiceConfig);
  ipcMain.handle(AppEvent.ResetSelect, handleResetSelect);
  ipcMain.handle(AppEvent.SelectChange, handleOptionSelect);
  ipcMain.handle(AppEvent.SetSelectItems, handleSetSelectItems);
  ipcMain.handle(AppEvent.ShowMessageBox, handleShowMessageBox);
  ipcMain.handle(AppEvent.ShowSelect, handleShowSelect);

  nativeTheme.on('updated', handleThemeUpdate);
};

export default initializeListeners;
