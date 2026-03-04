import { ShowSaveDialogOptions } from '@pomello-desktop/domain';
import { dialog, IpcMainInvokeEvent } from 'electron';

export const handleShowSaveDialog = async (
  _event: IpcMainInvokeEvent,
  options: ShowSaveDialogOptions
): Promise<string | null> => {
  const result = await dialog.showSaveDialog({
    defaultPath: options.defaultPath,
    filters: options.filters,
    properties: ['createDirectory', 'showOverwriteConfirmation'],
  });

  if (result.canceled) {
    return null;
  }

  return result.filePath;
};
