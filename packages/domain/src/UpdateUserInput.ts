import { PomelloUser } from './PomelloUser';

export type UpdateUserInput = Pick<PomelloUser, 'name' | 'timezone'>;
