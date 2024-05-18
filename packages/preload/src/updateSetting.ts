import { AppEvent, Settings } from '@pomello-desktop/domain';
import { ipcRenderer } from 'electron';

const updateSetting = <TSetting extends keyof Settings>(
  setting: TSetting,
  value: Settings[TSetting]
): Promise<void> => ipcRenderer.invoke(AppEvent.UpdateSetting, setting, value);

export default updateSetting;
