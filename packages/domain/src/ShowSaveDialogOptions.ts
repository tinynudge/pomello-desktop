import { FileFilter } from 'electron';

export type ShowSaveDialogOptions = {
  defaultPath?: string;
  filters?: FileFilter[];
};
