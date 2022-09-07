import { ServiceProvider } from '@/shared/context/ServiceContext';
import useInitializeService from '@/shared/hooks/useInitializeService';
import { LabeledHotkeys, ServiceRegistry } from '@domain';
import cc from 'classcat';
import { FC, Fragment, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from './App.module.scss';
import { selectOverlayView, selectServiceId, serviceChange } from './appSlice';
import Layout from './components/Layout';
import Routes from './components/Routes';
import { DialActionsProvider } from './context/DialActionsContext';
import { HotkeysProvider } from './context/HotkeysContext';
import useTimerSounds from './hooks/useTimerSounds';
import Content from './ui/Content';
import LoadingText from './ui/LoadingText';
import AddNoteView from './views/AddNoteView';
import SelectServiceView from './views/SelectServiceView';

interface AppProps {
  hotkeys: LabeledHotkeys;
  services: ServiceRegistry;
}

const App: FC<AppProps> = ({ hotkeys, services }) => {
  useTimerSounds();

  const dispatch = useDispatch();

  const serviceId = useSelector(selectServiceId);

  useEffect(() => {
    return window.app.onServicesChange(services => {
      dispatch(serviceChange(services.activeServiceId));
    });
  });

  const { activeService, isReady } = useInitializeService(services, serviceId);

  const overlayView = useSelector(selectOverlayView);

  const ServiceContainer = activeService?.service.Container ?? Fragment;

  return (
    <HotkeysProvider hotkeys={hotkeys}>
      <DialActionsProvider>
        <Layout>
          {activeService ? (
            <ServiceProvider service={activeService}>
              {overlayView && <AddNoteView noteType={overlayView} />}
              <Content className={cc({ [styles.contentHidden]: Boolean(overlayView) })}>
                <ServiceContainer>
                  <Routes />
                </ServiceContainer>
              </Content>
            </ServiceProvider>
          ) : !isReady && serviceId ? (
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
