import { ServiceProvider } from '@/shared/context/ServiceContext';
import useInitializeService from '@/shared/hooks/useInitializeService';
import useTranslation from '@/shared/hooks/useTranslation';
import { LabeledHotkeys, ServiceRegistry } from '@domain';
import cc from 'classcat';
import { FC, Fragment, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from './App.module.scss';
import { selectOverlayView, selectServiceId, serviceChange, setOverlayView } from './appSlice';
import Layout from './components/Layout';
import Routes from './components/Routes';
import { DialActionsProvider } from './context/DialActionsContext';
import { HotkeysProvider } from './context/HotkeysContext';
import useTimerSounds from './hooks/useTimerSounds';
import Content from './ui/Content';
import LoadingText from './ui/LoadingText';
import AddNoteView from './views/AddNoteView';
import CreateTaskView from './views/CreateTaskView';
import SelectServiceView from './views/SelectServiceView';

interface AppProps {
  hotkeys: LabeledHotkeys;
  services: ServiceRegistry;
}

const App: FC<AppProps> = ({ hotkeys, services }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  useTimerSounds();

  const serviceId = useSelector(selectServiceId);

  useEffect(() => {
    return window.app.onServicesChange(services => {
      dispatch(serviceChange(services.activeServiceId));
    });
  });

  const { activeService, status } = useInitializeService(services, serviceId);

  const overlayView = useSelector(selectOverlayView);

  const handleTaskCreate = () => {
    if (activeService?.service.handleTaskCreate) {
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
        <Layout onTaskCreate={handleTaskCreate}>
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
