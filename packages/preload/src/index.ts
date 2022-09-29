import { contextBridge } from 'electron';
import decryptValue from './decryptValue';
import encryptValue from './encryptValue';
import getActiveServiceId from './getActiveServiceId';
import getHotkeys from './getHotkeys';
import getSettings from './getSettings';
import getThemeCss from './getThemeCss';
import getTranslations from './getTranslations';
import hideSelect from './hideSelect';
import onSelectChange from './onSelectChange';
import onSelectHide from './onSelectHide';
import onServicesChange from './onServicesChange';
import onSetSelectItems from './onSetSelectItems';
import onShowSelect from './onShowSelect';
import onThemeCssChange from './onThemeCssChange';
import openUrl from './openUrl';
import registerServiceConfig from './registerServiceConfig';
import selectOption from './selectOption';
import setActiveServiceId from './setActiveServiceId';
import setSelectBounds from './setSelectBounds';
import setSelectItems from './setSelectItems';
import showAuthWindow from './showAuthWindow';
import showMessageBox from './showMessageBox';
import showSelect from './showSelect';
import writeClipboardText from './writeClipboardText';

const api = {
  decryptValue,
  encryptValue,
  getActiveServiceId,
  getHotkeys,
  getSettings,
  getThemeCss,
  getTranslations,
  hideSelect,
  onSelectChange,
  onSelectHide,
  onServicesChange,
  onSetSelectItems,
  onShowSelect,
  onThemeCssChange,
  openUrl,
  registerServiceConfig,
  selectOption,
  setActiveServiceId,
  setSelectBounds,
  setSelectItems,
  showAuthWindow,
  showMessageBox,
  showSelect,
  writeClipboardText,
};

contextBridge.exposeInMainWorld('app', api);

export default api;
