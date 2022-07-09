import { contextBridge } from 'electron';
import getSettings from './getSettings';
import getThemeCss from './getThemeCss';
import onSelectChange from './onSelectChange';
import onSelectShow from './onSelectShow';
import onThemeCssChange from './onThemeCssChange';
import registerStore from './registerStore';
import selectOption from './selectOption';
import showSelect from './showSelect';

const api = {
  getSettings,
  getThemeCss,
  onSelectChange,
  onSelectShow,
  onThemeCssChange,
  registerStore,
  selectOption,
  showSelect,
};

contextBridge.exposeInMainWorld('app', api);

export default api;
