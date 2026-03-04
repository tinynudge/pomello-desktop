import { WriteFileOptions } from '@pomello-desktop/domain';
import { IpcMainInvokeEvent } from 'electron';
import { promises as fs } from 'fs';

export const handleWriteFile = async (
  _event: IpcMainInvokeEvent,
  options: WriteFileOptions
): Promise<void> => {
  await fs.writeFile(options.filePath, options.content, 'utf-8');
};
