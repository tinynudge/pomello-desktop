import { PomelloApiResponse, PomelloUser } from '@pomello-desktop/domain';
import { PomelloApiContext } from './createPomelloApi';

export const fetchUser = async ({ client }: PomelloApiContext): Promise<PomelloUser> => {
  const { data } = await client.get('users').json<PomelloApiResponse<PomelloUser>>();

  return data;
};
