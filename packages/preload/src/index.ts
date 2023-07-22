import { contextBridge } from 'electron';
import getSettings from './getSettings';
import getThemeCss from './getThemeCss';
import onThemeCssChange from './onThemeCssChange';
import showMessageBox from './showMessageBox';
import getTranslations from './getTranslations';

export const api = {
  getSettings,
  getThemeCss,
  getTranslations,
  onThemeCssChange,
  showMessageBox,
};

contextBridge.exposeInMainWorld('app', api);
