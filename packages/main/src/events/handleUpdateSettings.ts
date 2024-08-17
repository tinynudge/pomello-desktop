import { getSettings } from '@/getSettings';
import { Settings } from '@pomello-desktop/domain';
import { IpcMainInvokeEvent } from 'electron';

export const handleUpdateSettings = async (
  _event: IpcMainInvokeEvent,
  updatedSettings: Partial<Settings>
): Promise<void> => {
  const settings = getSettings();

  settings.set(updatedSettings);
};
