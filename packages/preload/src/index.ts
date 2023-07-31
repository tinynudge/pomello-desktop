import { contextBridge } from 'electron';
import getSettings from './getSettings';
import getThemeCss from './getThemeCss';
import getTranslations from './getTranslations';
import logMessage from './logMessage';
import onSelectChange from './onSelectChange';
import onSelectReset from './onSelectReset';
import onServicesChange from './onServicesChange';
import onSetSelectItems from './onSetSelectItems';
import onSettingsChange from './onSettingsChange';
import onShowSelect from './onShowSelect';
import onThemeCssChange from './onThemeCssChange';
import registerServiceConfig from './registerServiceConfig';
import resetSelect from './resetSelect';
import setSelectItems from './setSelectItems';
import showMessageBox from './showMessageBox';
import showSelect from './showSelect';

export const api = {
  getSettings,
  getThemeCss,
  getTranslations,
  logMessage,
  onShowSelect,
  onSelectChange,
  onSelectReset,
  onServicesChange,
  onSetSelectItems,
  onSettingsChange,
  onThemeCssChange,
  registerServiceConfig,
  resetSelect,
  setSelectItems,
  showMessageBox,
  showSelect,
};

contextBridge.exposeInMainWorld('app', api);
