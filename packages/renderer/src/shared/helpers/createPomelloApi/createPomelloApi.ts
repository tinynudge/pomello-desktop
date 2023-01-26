import { PomelloApi, PomelloServiceConfig, ServiceConfig } from '@domain';
import bindContext from '../bindContext';
import fetchUser from './fetchUser';

export interface PomelloApiContext {
  getToken(): string | null;
}

const createPomelloApi = (config: ServiceConfig<PomelloServiceConfig>): PomelloApi => {
  let { token: encryptedToken } = config.get();
  let token: string | null = null;

  if (encryptedToken) {
    token = window.app.decryptValue(encryptedToken);
  }

  config.onChange(updatedConfig => {
    if (updatedConfig.token === encryptedToken) {
      return;
    }

    encryptedToken = updatedConfig.token;
    token = encryptedToken ? window.app.decryptValue(encryptedToken) : null;
  });

  const getToken = () => token;

  return bindContext({ fetchUser }, { getToken });
};

export default createPomelloApi;
