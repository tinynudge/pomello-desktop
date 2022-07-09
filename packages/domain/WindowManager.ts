import { BrowserWindow } from 'electron';
import { FindOrCreateWindowOptions } from './FindOrCreateWindowOptions';

export interface WindowManager {
  findOrCreateWindow(options: FindOrCreateWindowOptions): Promise<BrowserWindow>;
  findOrFailWindow(id: string): BrowserWindow;
  getAllWindows(): BrowserWindow[];
}
