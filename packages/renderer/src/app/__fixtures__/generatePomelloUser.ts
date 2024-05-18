import { PomelloApiResponse, PomelloUser } from '@pomello-desktop/domain';

export const generatePomelloUser = (
  values: Partial<PomelloUser> = {}
): PomelloApiResponse<PomelloUser> => ({
  data: {
    email: values.email ?? 'thomas@tester.com',
    name: values.name ?? 'Thomas Tester',
    timezone: values.timezone ?? 'America/Chicago',
    type: values.type ?? 'premium',
  },
});
