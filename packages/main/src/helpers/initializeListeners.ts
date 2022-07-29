import handleGetSettings from '@/events/handleGetSettings';
import handleGetThemeCss from '@/events/handleGetThemeCss';
import handleGetTranslations from '@/events/handleGetTranslations';
import handleSelectHide from '@/events/handleSelectHide';
import handleOptionSelect from '@/events/handleOptionSelect';
import handleRegisterStore from '@/events/handleRegisterStore';
import handleSetSelectBounds from '@/events/handleSetSelectBounds';
import handleSetSelectItems from '@/events/handleSetSelectItems';
import handleShowSelect from '@/events/handleShowSelect';
import handleThemeUpdate from '@/events/handleThemeUpdate';
import { AppEvent } from '@domain';
import { ipcMain, nativeTheme } from 'electron';

const initializeListeners = (): void => {
  ipcMain.handle(AppEvent.GetSettings, handleGetSettings);
  ipcMain.handle(AppEvent.GetThemeCss, handleGetThemeCss);
  ipcMain.handle(AppEvent.GetTranslations, handleGetTranslations);
  ipcMain.handle(AppEvent.HideSelect, handleSelectHide);
  ipcMain.handle(AppEvent.RegisterStore, handleRegisterStore);
  ipcMain.handle(AppEvent.SelectOption, handleOptionSelect);
  ipcMain.handle(AppEvent.SetSelectBounds, handleSetSelectBounds);
  ipcMain.handle(AppEvent.SetSelectItems, handleSetSelectItems);
  ipcMain.handle(AppEvent.ShowSelect, handleShowSelect);

  nativeTheme.on('updated', handleThemeUpdate);
};

export default initializeListeners;
