import {
  selectOverlayView,
  selectServiceId,
  selectSettings,
  serviceChange,
  setOverlayView,
  settingsChange,
} from '@/app/appSlice';
import usePomelloService from '@/app/hooks/usePomelloService';
import useTimerSounds from '@/app/hooks/useTimerSounds';
import Content from '@/app/ui/Content';
import LoadingText from '@/app/ui/LoadingText';
import AddNoteView from '@/app/views/AddNoteView';
import CreateTaskView from '@/app/views/CreateTaskView';
import SelectServiceView from '@/app/views/SelectServiceView';
import { ServiceProvider } from '@/shared/context/ServiceContext';
import useInitializeService from '@/shared/hooks/useInitializeService';
import useTranslation from '@/shared/hooks/useTranslation';
import { Logger, PomelloEventType, ServiceRegistry } from '@domain';
import { PomelloEvent } from '@tinynudge/pomello-service';
import cc from 'classcat';
import { FC, Fragment, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Layout from '../Layout';
import Routes from '../Routes';
import styles from './App.module.scss';
import useCheckPomelloAccount from './useCheckPomelloAccount';
import useLogPomelloEvents from './useLogPomelloEvents';
import useMonitorPowerChange from './useMonitorPowerChange';
import useOpenTask from './useOpenTask';

interface AppProps {
  logger: Logger;
  services: ServiceRegistry;
}

const App: FC<AppProps> = ({ logger, services }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const settings = useSelector(selectSettings);

  useEffect(() => {
    const handleWindowClose = async (event: BeforeUnloadEvent) => {
      if (!settings.warnBeforeAppQuit) {
        return;
      }

      event.returnValue = false;

      const { response } = await window.app.showMessageBox({
        type: 'question',
        message: t('quitAppMessage'),
        buttons: [t('quitAppConfirm'), t('quitAppCancel')],
        defaultId: 0,
        cancelId: 1,
      });

      if (response === 0) {
        window.app.quitApp();
      }
    };

    window.addEventListener('beforeunload', handleWindowClose);

    return () => {
      window.removeEventListener('beforeunload', handleWindowClose);
    };
  }, [settings.warnBeforeAppQuit, t]);

  const serviceId = useSelector(selectServiceId);

  useEffect(() => {
    return window.app.onServicesChange(services => {
      dispatch(serviceChange(services.activeServiceId));
    });
  });

  useEffect(() => {
    return window.app.onSettingsChange(settings => {
      dispatch(settingsChange(settings));
    });
  }, [dispatch]);

  const { activeService, status } = useInitializeService({ logger, services, serviceId });

  useLogPomelloEvents();
  useTimerSounds();
  useOpenTask(activeService?.service);

  const service = usePomelloService();

  useMonitorPowerChange({ logger, service });

  useEffect(() => {
    const onPomelloEvent = activeService?.service.onPomelloEvent;

    if (!onPomelloEvent) {
      return;
    }

    const unsubscribeHandlers = Object.values(PomelloEventType).map(eventType => {
      const type = eventType as PomelloEventType;

      const handler = (event: PomelloEvent) => onPomelloEvent(type, event);

      service.on(type, handler);

      return { type, handler };
    });

    return () => {
      unsubscribeHandlers.forEach(({ type, handler }) => service.off(type, handler));
    };
  }, [activeService?.service.onPomelloEvent, service]);

  useCheckPomelloAccount();

  const overlayView = useSelector(selectOverlayView);

  const handleTaskCreate = () => {
    if (activeService?.service.onTaskCreate) {
      dispatch(setOverlayView('create-task'));
      return;
    }

    const message =
      status === 'READY'
        ? t('serviceActionUnavailable', { service: activeService.service.displayName })
        : status === 'INITIALIZING'
        ? t('createTaskNotReadyMessage')
        : t('createTaskNoServiceMessage');

    new Notification(t('createTaskDisabledHeading'), {
      body: message,
    });
  };

  const ServiceContainer = activeService?.service.Container ?? Fragment;

  return (
    <ServiceProvider service={activeService}>
      <Layout logger={logger} onTaskCreate={handleTaskCreate}>
        {status === 'READY' ? (
          <>
            {overlayView === 'create-task' ? (
              <CreateTaskView />
            ) : overlayView ? (
              <AddNoteView noteType={overlayView} />
            ) : null}
            <Content className={cc({ [styles.contentHidden]: Boolean(overlayView) })}>
              <ServiceContainer>
                <Routes />
              </ServiceContainer>
            </Content>
          </>
        ) : status === 'INITIALIZING' ? (
          <Content>
            <LoadingText />
          </Content>
        ) : (
          <SelectServiceView services={services} />
        )}
      </Layout>
    </ServiceProvider>
  );
};

export default App;
