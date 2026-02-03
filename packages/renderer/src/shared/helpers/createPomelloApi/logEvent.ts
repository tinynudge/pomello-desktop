import { PomelloApiResponse } from '@pomello-desktop/domain';
import { TrackingEvent, TrackingEventInput } from '@tinynudge/pomello-service';
import { PomelloApiContext } from './createPomelloApi';

export const logEvent = async (
  { client }: PomelloApiContext,
  event: TrackingEventInput
): Promise<TrackingEvent> => {
  const { data } = await client
    .post('events', {
      json: {
        ...event,
        start_time: Math.round(event.start_time / 1000),
      },
    })
    .json<PomelloApiResponse<TrackingEvent>>();

  return data;
};
