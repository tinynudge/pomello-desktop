import {
  selectOverlayView,
  selectServiceId,
  selectSettings,
  serviceChange,
  setOverlayView,
} from '@/app/appSlice';
import { DialActionsProvider } from '@/app/context/DialActionsContext';
import { HotkeysProvider } from '@/app/context/HotkeysContext';
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
import { LabeledHotkeys, Logger, PomelloEventType, ServiceRegistry } from '@domain';
import { PomelloEvent } from '@tinynudge/pomello-service';
import cc from 'classcat';
import { FC, Fragment, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Layout from '../Layout';
import Routes from '../Routes';
import styles from './App.module.scss';
import useCheckPomelloAccount from './useCheckPomelloAccount';

interface AppProps {
  hotkeys: LabeledHotkeys;
  logger: Logger;
  services: ServiceRegistry;
}

const App: FC<AppProps> = ({ hotkeys, logger, services }) => {
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

  useTimerSounds();

  const serviceId = useSelector(selectServiceId);

  useEffect(() => {
    return window.app.onServicesChange(services => {
      dispatch(serviceChange(services.activeServiceId));
    });
  });

  const { activeService, status } = useInitializeService({ logger, services, serviceId, settings });

  const service = usePomelloService();

  useEffect(() => {
    // This should only fire in dev as <App> shouldn't unmount in production. We
    // add this to avoid any potential cache issues due to useInitializeService
    // re-running and clearing any previous cache that existed before HMR.
    return () => {
      service.reset({ reinitialize: true });
    };
  }, [service]);

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
    <HotkeysProvider hotkeys={hotkeys}>
      <DialActionsProvider>
        <Layout activeService={activeService} logger={logger} onTaskCreate={handleTaskCreate}>
          {status === 'READY' ? (
            <ServiceProvider service={activeService}>
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
            </ServiceProvider>
          ) : status === 'INITIALIZING' ? (
            <Content>
              <LoadingText />
            </Content>
          ) : (
            <SelectServiceView services={services} />
          )}
        </Layout>
      </DialActionsProvider>
    </HotkeysProvider>
  );
};

export default App;
