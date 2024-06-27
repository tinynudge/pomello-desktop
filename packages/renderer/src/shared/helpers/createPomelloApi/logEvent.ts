import { PomelloApiResponse } from '@pomello-desktop/domain';
import { SavedTrackingEvent, TrackingEvent } from '@tinynudge/pomello-service';
import { PomelloApiContext } from './createPomelloApi';

export const logEvent = async (
  { client }: PomelloApiContext,
  event: TrackingEvent
): Promise<SavedTrackingEvent> => {
  const { data } = await client
    .post('events', {
      json: {
        ...event,
        start_time: Math.round(event.start_time / 1000),
      },
    })
    .json<PomelloApiResponse<SavedTrackingEvent>>();

  return data;
};
