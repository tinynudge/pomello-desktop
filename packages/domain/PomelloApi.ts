import { PomelloUser } from './PomelloUser';

export interface PomelloApi {
  fetchUser(): Promise<PomelloUser>;
}
