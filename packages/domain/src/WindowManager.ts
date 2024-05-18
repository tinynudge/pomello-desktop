import { BrowserWindow } from 'electron';
import { FindOrCreateWindowOptions } from './FindOrCreateWindowOptions';

export interface WindowManager {
  destroyWindow(id: string): void;
  findOrCreateWindow(options: FindOrCreateWindowOptions): Promise<BrowserWindow>;
  findOrFailWindow(id: string): BrowserWindow;
  getAllWindows(): BrowserWindow[];
  getWindow(id: string): BrowserWindow | undefined;
}
