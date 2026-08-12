import { Settings } from '@pomello-desktop/domain';
import { PomelloApiContext } from './createPomelloApi';

export const saveSettings = async (
  { client }: PomelloApiContext,
  settings: Settings
): Promise<void> => {
  await client.post('settings', {
    json: { settings },
  });
};
