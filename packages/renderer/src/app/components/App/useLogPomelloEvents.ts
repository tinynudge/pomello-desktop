import { usePomelloService } from '@/app/context/PomelloContext';
import { useRuntime } from '@/shared/context/RuntimeContext';
import { PomelloEvent } from '@tinynudge/pomello-service';
import { onCleanup, onMount } from 'solid-js';

export const useLogPomelloEvents = () => {
  const pomelloService = usePomelloService();
  const { logger } = useRuntime();

  onMount(() => {
    const createLogHandler = (message: string) => (event: PomelloEvent) =>
      logger.debug({ message, event });

    const handleAppInitialize = createLogHandler('Did initialize Pomello service');
    const handleOvertimeEnd = createLogHandler('Did overtime end');
    const handleOvertimeStart = createLogHandler('Did overtime start');
    const handleTaskEnd = createLogHandler('Did task end');
    const handleTaskSelect = createLogHandler('Did select task');
    const handleTaskStart = createLogHandler('Did start task');
    const handleTaskVoid = createLogHandler('Did void task');
    const handleTimerDestroy = createLogHandler('Did destroy timer');
    const handleTimerEnd = createLogHandler('Did end timer');
    const handleTimerPause = createLogHandler('Did pause timer');
    const handleTimerResume = createLogHandler('Did resume timer');
    const handleTimerSkip = createLogHandler('Did skip timer');
    const handleTimerStart = createLogHandler('Did start timer');

    pomelloService.on('appInitialize', handleAppInitialize);
    pomelloService.on('overtimeEnd', handleOvertimeEnd);
    pomelloService.on('overtimeStart', handleOvertimeStart);
    pomelloService.on('taskEnd', handleTaskEnd);
    pomelloService.on('taskSelect', handleTaskSelect);
    pomelloService.on('taskStart', handleTaskStart);
    pomelloService.on('taskVoid', handleTaskVoid);
    pomelloService.on('timerDestroy', handleTimerDestroy);
    pomelloService.on('timerEnd', handleTimerEnd);
    pomelloService.on('timerPause', handleTimerPause);
    pomelloService.on('timerResume', handleTimerResume);
    pomelloService.on('timerSkip', handleTimerSkip);
    pomelloService.on('timerStart', handleTimerStart);

    onCleanup(() => {
      pomelloService.off('appInitialize', handleAppInitialize);
      pomelloService.off('overtimeEnd', handleOvertimeEnd);
      pomelloService.off('overtimeStart', handleOvertimeStart);
      pomelloService.off('taskEnd', handleTaskEnd);
      pomelloService.off('taskSelect', handleTaskSelect);
      pomelloService.off('taskStart', handleTaskStart);
      pomelloService.off('taskVoid', handleTaskVoid);
      pomelloService.off('timerDestroy', handleTimerDestroy);
      pomelloService.off('timerEnd', handleTimerEnd);
      pomelloService.off('timerPause', handleTimerPause);
      pomelloService.off('timerResume', handleTimerResume);
      pomelloService.off('timerSkip', handleTimerSkip);
      pomelloService.off('timerStart', handleTimerStart);
    });
  });
};
