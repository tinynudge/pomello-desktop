import { PomelloApiResponse, PomelloUser, UpdateUserInput } from '@pomello-desktop/domain';
import { PomelloApiContext } from './createPomelloApi';

export const updateUser = async (
  { client }: PomelloApiContext,
  input: UpdateUserInput
): Promise<PomelloUser> => {
  const { data } = await client
    .post('users', { json: input })
    .json<PomelloApiResponse<PomelloUser>>();

  return data;
};
