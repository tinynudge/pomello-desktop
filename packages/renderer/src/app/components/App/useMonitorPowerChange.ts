import { usePomelloService } from '@/app/context/PomelloContext';
import { useRuntime } from '@/shared/context/RuntimeContext';
import { onCleanup, onMount } from 'solid-js';

export const useMonitorPowerChange = () => {
  const { logger } = useRuntime();
  const service = usePomelloService();

  onMount(() => {
    const unsubscribe = window.app.onPowerMonitorChange(status => {
      if (status === 'suspend') {
        logger.debug('Will suspend Pomello service');

        service.suspendService();
      } else if (status === 'resume') {
        logger.debug('Will resume Pomello service');

        service.resumeService();
      }
    });

    onCleanup(unsubscribe);
  });
};
