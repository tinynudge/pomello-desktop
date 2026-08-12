import { PomelloApiResponse, Settings } from '@pomello-desktop/domain';
import { PomelloApiContext } from './createPomelloApi';

export const fetchSettings = async ({ client }: PomelloApiContext): Promise<Settings | null> => {
  const { data } = await client.get('settings').json<PomelloApiResponse<Settings | null>>();

  return data ?? null;
};
