import getSettings from '@/helpers/getSettings';
import { Settings } from '@domain';

const handleGetSettings = async (): Promise<Settings> => {
  const settings = getSettings();

  return settings.all();
};

export default handleGetSettings;
