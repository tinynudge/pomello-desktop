import { handleAppQuit } from '@/events/handleAppQuit';
import { handleAudioFileProtocol } from '@/events/handleAudioFileProtocol';
import { handleClipboardTextWrite } from '@/events/handleClipboardTextWrite';
import { handleDecryptValue } from '@/events/handleDecryptValue';
import { handleEncryptValue } from '@/events/handleEncryptValue';
import { handleGetActiveServiceId } from '@/events/handleGetActiveServiceId';
import { handleGetHotkeys } from '@/events/handleGetHotkeys';
import { handleGetSettings } from '@/events/handleGetSettings';
import { handleGetThemeCss } from '@/events/handleGetThemeCss';
import { handleGetTranslations } from '@/events/handleGetTranslations';
import { handleLogMessage } from '@/events/handleLogMessage';
import { handleOpenUrl } from '@/events/handleOpenUrl';
import { handleOptionSelect } from '@/events/handleOptionSelect';
import { handlePowerMonitorChange } from '@/events/handlePowerMonitorChange';
import { handleRegisterServiceConfig } from '@/events/handleRegisterServiceConfig';
import { handleResetSelect } from '@/events/handleResetSelect';
import { handleSelectHide } from '@/events/handleSelectHide';
import { handleSetSelectBounds } from '@/events/handleSetSelectBounds';
import { handleSetSelectItems } from '@/events/handleSetSelectItems';
import { handleSetStoreItem } from '@/events/handleSetStoreItem';
import { handleShowAuthWindow } from '@/events/handleShowAuthWindow';
import { handleShowDashboardWindow } from '@/events/handleShowDashboardWindow';
import { handleShowMessageBox } from '@/events/handleShowMessageBox';
import { handleShowSelect } from '@/events/handleShowSelect';
import { handleThemeUpdate } from '@/events/handleThemeUpdate';
import { handleUnsetStoreItem } from '@/events/handleUnsetStoreItem';
import { handleUpdateSetting } from '@/events/handleUpdateSetting';
import { AppEvent, AppProtocol } from '@pomello-desktop/domain';
import { ipcMain, nativeTheme, powerMonitor, protocol } from 'electron';

export const initializeListeners = (): void => {
  ipcMain.handle(AppEvent.ClipboardTextWrite, handleClipboardTextWrite);
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
  ipcMain.handle(AppEvent.SetSelectBounds, handleSetSelectBounds);
  ipcMain.handle(AppEvent.SetSelectItems, handleSetSelectItems);
  ipcMain.handle(AppEvent.SetStoreItem, handleSetStoreItem);
  ipcMain.handle(AppEvent.ShowAuthWindow, handleShowAuthWindow);
  ipcMain.handle(AppEvent.ShowDashboardWindow, handleShowDashboardWindow);
  ipcMain.handle(AppEvent.ShowMessageBox, handleShowMessageBox);
  ipcMain.handle(AppEvent.ShowSelect, handleShowSelect);
  ipcMain.handle(AppEvent.UnsetStoreItem, handleUnsetStoreItem);
  ipcMain.handle(AppEvent.UpdateSetting, handleUpdateSetting);

  ipcMain.on(AppEvent.DecryptValue, handleDecryptValue);
  ipcMain.on(AppEvent.EncryptValue, handleEncryptValue);

  nativeTheme.on('updated', handleThemeUpdate);

  powerMonitor.on('resume', () => handlePowerMonitorChange('resume'));
  powerMonitor.on('suspend', () => handlePowerMonitorChange('suspend'));

  protocol.handle(AppProtocol.Audio.replace('://', ''), handleAudioFileProtocol);
};
