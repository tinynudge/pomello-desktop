import { contextBridge } from 'electron';
import getSettings from './getSettings';
import getThemeCss from './getThemeCss';
import getTranslations from './getTranslations';
import logMessage from './logMessage';
import onServicesChange from './onServicesChange';
import onSettingsChange from './onSettingsChange';
import onThemeCssChange from './onThemeCssChange';
import registerServiceConfig from './registerServiceConfig';
import showMessageBox from './showMessageBox';

export const api = {
  getSettings,
  getThemeCss,
  getTranslations,
  logMessage,
  onServicesChange,
  onSettingsChange,
  onThemeCssChange,
  registerServiceConfig,
  showMessageBox,
};

contextBridge.exposeInMainWorld('app', api);
