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
  | 'width'
  | 'x'
  | 'y';

export interface FindOrCreateWindowOptions
  extends Pick<BrowserWindowConstructorOptions, BrowserWindowTypes> {
  id: string;
  path: string;
  preloadPath?: string;
  showDevTools?: boolean;
  showOnReady?: boolean;
}
