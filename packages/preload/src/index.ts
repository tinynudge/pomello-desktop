import { contextBridge } from 'electron';
import getActiveServiceId from './getActiveServiceId';
import getHotkeys from './getHotkeys';
import getSettings from './getSettings';
import getThemeCss from './getThemeCss';
import getTranslations from './getTranslations';
import hideSelect from './hideSelect';
import logMessage from './logMessage';
import onSelectChange from './onSelectChange';
import onSelectHide from './onSelectHide';
import onSelectReset from './onSelectReset';
import onSelectShow from './onSelectShow';
import onServicesChange from './onServicesChange';
import onSetSelectItems from './onSetSelectItems';
import onSettingsChange from './onSettingsChange';
import onThemeCssChange from './onThemeCssChange';
import registerServiceConfig from './registerServiceConfig';
import resetSelect from './resetSelect';
import selectChange from './selectChange';
import setActiveServiceId from './setActiveServiceId';
import setSelectBounds from './setSelectBounds';
import setSelectItems from './setSelectItems';
import showMessageBox from './showMessageBox';
import showSelect from './showSelect';

export const api = {
  getActiveServiceId,
  getHotkeys,
  getSettings,
  getThemeCss,
  getTranslations,
  hideSelect,
  logMessage,
  onSelectChange,
  onSelectHide,
  onSelectReset,
  onSelectShow,
  onServicesChange,
  onSetSelectItems,
  onSettingsChange,
  onThemeCssChange,
  registerServiceConfig,
  resetSelect,
  selectChange,
  setActiveServiceId,
  setSelectBounds,
  setSelectItems,
  showMessageBox,
  showSelect,
};

contextBridge.exposeInMainWorld('app', api);
