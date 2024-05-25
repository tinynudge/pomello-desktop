import { BrowserWindowConstructorOptions } from 'electron';

type BrowserWindowTypes =
  | 'alwaysOnTop'
  | 'autoHideMenuBar'
  | 'frame'
  | 'height'
  | 'minHeight'
  | 'minWidth'
  | 'modal'
  | 'movable'
  | 'parent'
  | 'resizable'
  | 'title'
  | 'titleBarStyle'
  | 'transparent'
  | 'webPreferences'
  | 'width'
  | 'x'
  | 'y';

export type FindOrCreateWindowOptions = Pick<
  BrowserWindowConstructorOptions,
  BrowserWindowTypes
> & {
  id: string;
  path: string;
  preloadPath?: string;
  showDevTools?: boolean;
  showOnReady?: boolean;
};
