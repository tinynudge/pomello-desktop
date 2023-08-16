import { contextBridge } from 'electron';
import decryptValue from './decryptValue';
import encryptValue from './encryptValue';
import getActiveServiceId from './getActiveServiceId';
import getHotkeys from './getHotkeys';
import getSettings from './getSettings';
import getThemeCss from './getThemeCss';
import getTranslations from './getTranslations';
import hideSelect from './hideSelect';
import logMessage from './logMessage';
import onPowerMonitorChange from './onPowerMonitorChange';
import onSelectChange from './onSelectChange';
import onSelectHide from './onSelectHide';
import onSelectReset from './onSelectReset';
import onServicesChange from './onServicesChange';
import onSetSelectItems from './onSetSelectItems';
import onSettingsChange from './onSettingsChange';
import onShowSelect from './onShowSelect';
import onThemeCssChange from './onThemeCssChange';
import openUrl from './openUrl';
import quitApp from './quitApp';
import registerServiceConfig from './registerServiceConfig';
import resetSelect from './resetSelect';
import selectOption from './selectOption';
import setActiveServiceId from './setActiveServiceId';
import setSelectBounds from './setSelectBounds';
import setSelectItems from './setSelectItems';
import showAuthWindow from './showAuthWindow';
import showMessageBox from './showMessageBox';
import showSelect from './showSelect';
import updateSetting from './updateSetting';
import writeClipboardText from './writeClipboardText';

export const api = {
  decryptValue,
  encryptValue,
  getActiveServiceId,
  getHotkeys,
  getSettings,
  getThemeCss,
  getTranslations,
  hideSelect,
  logMessage,
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
  showMessageBox,
  showSelect,
  updateSetting,
  writeClipboardText,
};

contextBridge.exposeInMainWorld('app', api);
