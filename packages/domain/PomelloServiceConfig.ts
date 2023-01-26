import { PomelloUser } from './PomelloUser';

export interface PomelloServiceConfig {
  didPromptRegistration?: boolean;
  token?: string;
  user?: PomelloUser;
}
