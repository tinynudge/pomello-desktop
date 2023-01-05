import handleAppQuit from '@/events/handleAppQuit';
import handleAudioFileProtocol from '@/events/handleAudioFileProtocol';
import handleDecryptValue from '@/events/handleDecryptValue';
import handleEncryptValue from '@/events/handleEncryptValue';
import handleGetActiveServiceId from '@/events/handleGetActiveServiceId';
import handleGetHotkeys from '@/events/handleGetHotkeys';
import handleGetSettings from '@/events/handleGetSettings';
import handleGetThemeCss from '@/events/handleGetThemeCss';
import handleGetTranslations from '@/events/handleGetTranslations';
import handleLogMessage from '@/events/handleLogMessage';
import handleOpenUrl from '@/events/handleOpenUrl';
import handleOptionSelect from '@/events/handleOptionSelect';
import handleRegisterServiceConfig from '@/events/handleRegisterServiceConfig';
import handleResetSelect from '@/events/handleResetSelect';
import handleSelectHide from '@/events/handleSelectHide';
import handleSelectReady from '@/events/handleSelectReady';
import handleSetSelectBounds from '@/events/handleSetSelectBounds';
import handleSetSelectItems from '@/events/handleSetSelectItems';
import handleSetStoreItem from '@/events/handleSetStoreItem';
import handleShowAuthWindow from '@/events/handleShowAuthWindow';
import handleShowMessageBox from '@/events/handleShowMessageBox';
import handleShowSelect from '@/events/handleShowSelect';
import handleThemeUpdate from '@/events/handleThemeUpdate';
import handleUnsetStoreItem from '@/events/handleUnsetStoreItem';
import { AppEvent, AppProtocol } from '@domain';
import { ipcMain, nativeTheme, protocol } from 'electron';

const initializeListeners = (): void => {
  ipcMain.handle(AppEvent.GetActiveServiceId, handleGetActiveServiceId);
  ipcMain.handle(AppEvent.GetHotkeys, handleGetHotkeys);
  ipcMain.handle(AppEvent.GetSettings, handleGetSettings);
  ipcMain.handle(AppEvent.GetThemeCss, handleGetThemeCss);
  ipcMain.handle(AppEvent.GetTranslations, handleGetTranslations);
  ipcMain.handle(AppEvent.HideSelect, handleSelectHide);
  ipcMain.handle(AppEvent.LogMessage, handleLogMessage);
  ipcMain.handle(AppEvent.OpenUrl, handleOpenUrl);
  ipcMain.handle(AppEvent.QuitApp, handleAppQuit);
  ipcMain.handle(AppEvent.RegisterServiceConfig, handleRegisterServiceConfig);
  ipcMain.handle(AppEvent.ResetSelect, handleResetSelect);
  ipcMain.handle(AppEvent.SelectOption, handleOptionSelect);
  ipcMain.handle(AppEvent.SelectReady, handleSelectReady);
  ipcMain.handle(AppEvent.SetSelectBounds, handleSetSelectBounds);
  ipcMain.handle(AppEvent.SetSelectItems, handleSetSelectItems);
  ipcMain.handle(AppEvent.SetStoreItem, handleSetStoreItem);
  ipcMain.handle(AppEvent.ShowAuthWindow, handleShowAuthWindow);
  ipcMain.handle(AppEvent.ShowMessageBox, handleShowMessageBox);
  ipcMain.handle(AppEvent.ShowSelect, handleShowSelect);
  ipcMain.handle(AppEvent.UnsetStoreItem, handleUnsetStoreItem);

  ipcMain.on(AppEvent.DecryptValue, handleDecryptValue);
  ipcMain.on(AppEvent.EncryptValue, handleEncryptValue);

  nativeTheme.on('updated', handleThemeUpdate);

  protocol.registerFileProtocol(AppProtocol.Audio.replace('://', ''), handleAudioFileProtocol);
};

export default initializeListeners;
