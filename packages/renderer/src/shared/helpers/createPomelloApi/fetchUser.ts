import { PomelloApiResponse, PomelloUser } from '@domain';
import { PomelloApiContext } from './createPomelloApi';

const fetchUser = async ({ client }: PomelloApiContext): Promise<PomelloUser> => {
  const { data } = await client.get('users').json<PomelloApiResponse<PomelloUser>>();

  return data;
};

export default fetchUser;
