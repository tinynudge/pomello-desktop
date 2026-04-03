import { PomelloApiContext } from './createPomelloApi';

export const deleteEvent = async (
  { client }: PomelloApiContext,
  eventId: string
): Promise<void> => {
  await client.delete(`events/${eventId}`);
};
