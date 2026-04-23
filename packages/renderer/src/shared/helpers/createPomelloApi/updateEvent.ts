import { UpdateEventInput } from '@pomello-desktop/domain';
import { PomelloApiContext } from './createPomelloApi';

export const updateEvent = async (
  { client }: PomelloApiContext,
  eventId: string,
  input: UpdateEventInput
): Promise<void> => {
  await client.put(`events/${eventId}`, { json: input });
};
