import getSettings from '@/getSettings';
import { Settings } from '@domain';
import { IpcMainInvokeEvent } from 'electron';

const handleUpdateSetting = async <TSetting extends keyof Settings>(
  _event: IpcMainInvokeEvent,
  setting: TSetting,
  value: Settings[TSetting]
): Promise<void> => {
  const settings = getSettings();

  settings.set(setting, value);
};

export default handleUpdateSetting;
