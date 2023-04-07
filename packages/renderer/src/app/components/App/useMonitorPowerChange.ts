import { Logger } from '@domain';
import { PomelloService } from '@tinynudge/pomello-service';
import { useEffect } from 'react';

interface UseMonitorPowerChangeOptions {
  logger: Logger;
  service: PomelloService;
}

const useMonitorPowerChange = ({ logger, service }: UseMonitorPowerChangeOptions) => {
  useEffect(() => {
    return window.app.onPowerMonitorChange(status => {
      if (status === 'suspend') {
        logger.debug('Will suspend Pomello service');

        service.suspendService();
      } else if (status === 'resume') {
        logger.debug('Will resume Pomello service');

        service.resumeService();
      }
    });
  }, [logger, service]);
};

export default useMonitorPowerChange;
