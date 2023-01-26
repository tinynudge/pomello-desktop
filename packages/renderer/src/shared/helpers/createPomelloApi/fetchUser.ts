import { PomelloUser } from '@domain';
import { PomelloApiContext } from './createPomelloApi';

const fetchUser = async ({ getToken }: PomelloApiContext): Promise<PomelloUser> => {
  const headers = new Headers({
    Accept: 'application/json, text/plain, */*',
    'Content-Type': 'application/json',
  });

  const token = getToken();

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  // We need to use fetch here because this gets called in an interval through
  // useCheckPomelloAccount. For some reason, when using an Axios client, the
  // number of listeners rises with each iteration and is never released to the
  // garbage collector.
  const response = await fetch(`${import.meta.env.VITE_APP_URL}/api/users`, { headers });

  if (!response.ok) {
    return Promise.reject(response.status);
  }

  const { data } = await response.json();

  return data;
};

export default fetchUser;
