import { AppEvent, Settings } from '@pomello-desktop/domain';
import { ipcRenderer } from 'electron';

export const updateSetting = <TSetting extends keyof Settings>(
  setting: TSetting,
  value: Settings[TSetting]
): Promise<void> => ipcRenderer.invoke(AppEvent.UpdateSetting, setting, value);
