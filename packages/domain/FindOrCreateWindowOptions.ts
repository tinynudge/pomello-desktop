import { BrowserWindowConstructorOptions } from 'electron';

type BrowserWindowTypes =
  | 'alwaysOnTop'
  | 'frame'
  | 'height'
  | 'minHeight'
  | 'minWidth'
  | 'modal'
  | 'parent'
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
