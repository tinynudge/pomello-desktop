import { contextBridge } from 'electron';
import getHotkeys from './getHotkeys';
import getSettings from './getSettings';
import getThemeCss from './getThemeCss';
import getTranslations from './getTranslations';
import hideSelect from './hideSelect';
import onSelectChange from './onSelectChange';
import onSelectHide from './onSelectHide';
import onSetSelectItems from './onSetSelectItems';
import onShowSelect from './onShowSelect';
import onThemeCssChange from './onThemeCssChange';
import openUrl from './openUrl';
import registerServiceConfig from './registerServiceConfig';
import selectOption from './selectOption';
import setSelectBounds from './setSelectBounds';
import setSelectItems from './setSelectItems';
import showSelect from './showSelect';

const api = {
  getHotkeys,
  getSettings,
  getThemeCss,
  getTranslations,
  hideSelect,
  onSelectChange,
  onSelectHide,
  onSetSelectItems,
  onShowSelect,
  onThemeCssChange,
  openUrl,
  registerServiceConfig,
  selectOption,
  setSelectBounds,
  setSelectItems,
  showSelect,
};

contextBridge.exposeInMainWorld('app', api);

export default api;
