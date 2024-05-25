import { PomelloUser } from './PomelloUser';

export type PomelloServiceConfig = {
  didPromptRegistration?: boolean;
  token?: string;
  user?: PomelloUser;
};
