import { contextBridge } from 'electron';
import { decryptValue } from './decryptValue';
import { encryptValue } from './encryptValue';
import { formatHotkey } from './formatHotkey';
import { getActiveServiceId } from './getActiveServiceId';
import { getDefaultHotkeys } from './getDefaultHotkeys';
import { getFilePath } from './getFilePath';
import { getHotkeys } from './getHotkeys';
import { getSettings } from './getSettings';
import { getSoundPath } from './getSoundPath';
import { getThemeCss } from './getThemeCss';
import { getTranslations } from './getTranslations';
import { hideSelect } from './hideSelect';
import { logMessage } from './logMessage';
import { onAppWindowFocus } from './onAppWindowFocus';
import { onHotkeysChange } from './onHotkeysChange';
import { onPowerMonitorChange } from './onPowerMonitorChange';
import { onSelectChange } from './onSelectChange';
import { onSelectHide } from './onSelectHide';
import { onSelectReset } from './onSelectReset';
import { onServicesChange } from './onServicesChange';
import { onSetSelectItems } from './onSetSelectItems';
import { onSettingsChange } from './onSettingsChange';
import { onShowSelect } from './onShowSelect';
import { onThemeCssChange } from './onThemeCssChange';
import { openUrl } from './openUrl';
import { quitApp } from './quitApp';
import { registerServiceConfig } from './registerServiceConfig';
import { resetSelect } from './resetSelect';
import { selectOption } from './selectOption';
import { setActiveServiceId } from './setActiveServiceId';
import { setSelectBounds } from './setSelectBounds';
import { setSelectItems } from './setSelectItems';
import { showAuthWindow } from './showAuthWindow';
import { showDashboardWindow } from './showDashboardWindow';
import { showMessageBox } from './showMessageBox';
import { showSelect } from './showSelect';
import { updateHotkeys } from './updateHotkeys';
import { updateSetting } from './updateSetting';
import { updateSettings } from './updateSettings';
import { writeClipboardText } from './writeClipboardText';

export const api = {
  decryptValue,
  encryptValue,
  formatHotkey,
  getActiveServiceId,
  getDefaultHotkeys,
  getFilePath,
  getHotkeys,
  getSettings,
  getSoundPath,
  getThemeCss,
  getTranslations,
  hideSelect,
  logMessage,
  onAppWindowFocus,
  onHotkeysChange,
  onPowerMonitorChange,
  onSelectChange,
  onSelectHide,
  onSelectReset,
  onServicesChange,
  onSetSelectItems,
  onSettingsChange,
  onShowSelect,
  onThemeCssChange,
  openUrl,
  quitApp,
  registerServiceConfig,
  resetSelect,
  selectOption,
  setActiveServiceId,
  setSelectBounds,
  setSelectItems,
  showAuthWindow,
  showDashboardWindow,
  showMessageBox,
  showSelect,
  updateHotkeys,
  updateSetting,
  updateSettings,
  writeClipboardText,
};

contextBridge.exposeInMainWorld('app', api);
