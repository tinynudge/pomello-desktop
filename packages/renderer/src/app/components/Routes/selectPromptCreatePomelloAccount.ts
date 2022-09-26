import { PomelloServiceConfig } from '@domain';

const selectPromptCreatePomelloAccount = (config: PomelloServiceConfig): boolean => {
  return !config.token && config.didPromptRegistration !== true;
};

export default selectPromptCreatePomelloAccount;
