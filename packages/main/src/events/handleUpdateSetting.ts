import { getSettings } from '@/getSettings';
import { Settings } from '@pomello-desktop/domain';
import { IpcMainInvokeEvent } from 'electron';

export const handleUpdateSetting = async <TSetting extends keyof Settings>(
  _event: IpcMainInvokeEvent,
  setting: TSetting,
  value: Settings[TSetting]
): Promise<void> => {
  const settings = getSettings();

  if (setting === 'timestamp') {
    settings.set(setting, value);
  } else {
    settings.set({
      [setting]: value,
      timestamp: Date.now(),
    });
  }
};
