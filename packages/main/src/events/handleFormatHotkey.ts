import { formatHotkey } from '@/helpers/formatHotkey';
import { IpcMainEvent } from 'electron';

export const handleFormatHotkey = (event: IpcMainEvent, binding: string): void => {
  event.returnValue = formatHotkey(binding);
};
