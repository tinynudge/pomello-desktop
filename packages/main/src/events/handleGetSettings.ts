import getSettings from '@/getSettings';
import { Settings } from '@pomello-desktop/domain';

const handleGetSettings = async (): Promise<Settings> => {
  const settings = getSettings();

  return settings.all();
};

export default handleGetSettings;
