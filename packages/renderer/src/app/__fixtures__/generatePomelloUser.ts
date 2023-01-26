import { PomelloUser } from '@domain';

const generatePomelloUser = (values: Partial<PomelloUser> = {}): PomelloUser => ({
  email: values.email ?? 'thomas@tester.com',
  name: values.name ?? 'Thomas Tester',
  timezone: values.timezone ?? 'America/Chicago',
  type: values.type ?? 'premium',
});

export default generatePomelloUser;
