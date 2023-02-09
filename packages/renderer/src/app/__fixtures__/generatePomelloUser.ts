import { PomelloApiResponse, PomelloUser } from '@domain';

const generatePomelloUser = (
  values: Partial<PomelloUser> = {}
): PomelloApiResponse<PomelloUser> => ({
  data: {
    email: values.email ?? 'thomas@tester.com',
    name: values.name ?? 'Thomas Tester',
    timezone: values.timezone ?? 'America/Chicago',
    type: values.type ?? 'premium',
  },
});

export default generatePomelloUser;
