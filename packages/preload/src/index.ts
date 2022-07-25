import { contextBridge } from 'electron';
import getSettings from './getSettings';
import getThemeCss from './getThemeCss';
import getTranslations from './getTranslations';
import onSelectChange from './onSelectChange';
import onSetSelectItems from './onSetSelectItems';
import onShowSelect from './onShowSelect';
import onThemeCssChange from './onThemeCssChange';
import registerStore from './registerStore';
import selectOption from './selectOption';
import setSelectBounds from './setSelectBounds';
import setSelectItems from './setSelectItems';
import showSelect from './showSelect';

const api = {
  getSettings,
  getThemeCss,
  getTranslations,
  onSelectChange,
  onSetSelectItems,
  onShowSelect,
  onThemeCssChange,
  registerStore,
  selectOption,
  setSelectBounds,
  setSelectItems,
  showSelect,
};

contextBridge.exposeInMainWorld('app', api);

export default api;
