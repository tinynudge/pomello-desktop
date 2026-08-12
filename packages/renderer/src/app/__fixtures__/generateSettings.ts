import { PomelloApiResponse, Settings } from '@pomello-desktop/domain';
import { createMockSettings } from '@/__fixtures__/createMockSettings';

export const generateSettings = (values: Partial<Settings> = {}): PomelloApiResponse<Settings> => ({
  data: createMockSettings(values),
});
