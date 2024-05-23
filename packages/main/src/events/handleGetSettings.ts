import { getSettings } from '@/getSettings';
import { Settings } from '@pomello-desktop/domain';

export const handleGetSettings = async (): Promise<Settings> => {
  const settings = getSettings();

  return settings.all();
};
