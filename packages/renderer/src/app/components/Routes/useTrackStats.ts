import usePomelloService from '@/app/hooks/usePomelloService';
import usePomelloApi from '@/shared/hooks/usePomelloApi';
import useService from '@/shared/hooks/useService';
import { PomelloTrackingEvent } from '@domain';
import {
  PomelloBreakEndEvent,
  PomelloEvent,
  PomelloTaskEndEvent,
} from '@tinynudge/pomello-service';
import { useEffect } from 'react';

const useTrackStats = () => {
  const pomelloApi = usePomelloApi();
  const pomelloService = usePomelloService();
  const service = useService();

  useEffect(() => {
    const createEventHandler = <TEvent extends PomelloEvent>(
      transformEvent: (event: TEvent) => PomelloTrackingEvent | void
    ) => {
      const eventHandler = (event: TEvent) => {
        const isTrackingEnabled = service.getTrackingStatus?.() ?? false;

        if (!isTrackingEnabled) {
          return;
        }

        const trackingEvent = transformEvent(event);

        if (trackingEvent) {
          pomelloApi.logEvent({
            ...trackingEvent,
            ...service.getAdditionalTrackingData?.(event),
          });
        }
      };

      return eventHandler;
    };

    const handleTaskEnd = createEventHandler<PomelloTaskEndEvent>(event => ({
      allotted_time: event.timer.totalTime,
      duration: event.timer.adjustedTotalTime - event.timer.time,
      service_id: event.taskId,
      start_time: event.timestamp,
      type: 'task',
    }));

    const handleBreakEnd = createEventHandler<PomelloBreakEndEvent>(event => ({
      allotted_time: event.timer.totalTime,
      duration: event.timer.adjustedTotalTime - event.timer.time,
      service_id: event.taskId,
      start_time: event.timestamp,
      meta: {
        type: event.timer.type === 'SHORT_BREAK' ? 'short' : 'long',
      },
      type: 'break',
    }));

    pomelloService.on('breakEnd', handleBreakEnd);
    pomelloService.on('taskEnd', handleTaskEnd);

    return () => {
      pomelloService.off('breakEnd', handleBreakEnd);
      pomelloService.off('taskEnd', handleTaskEnd);
    };
  }, [pomelloApi, pomelloService, service]);
};

export default useTrackStats;
