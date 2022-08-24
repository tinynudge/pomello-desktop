import { ServiceProvider } from '@/shared/context/ServiceContext';
import useInitializeService from '@/shared/hooks/useInitializeService';
import { LabeledHotkeys, ServiceRegistry } from '@domain';
import cc from 'classcat';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from './App.module.scss';
import { selectOverlayView, selectServiceId, serviceChange } from './appSlice';
import Layout from './components/Layout';
import Routes from './components/Routes';
import { DialActionsProvider } from './context/DialActionsContext';
import { HotkeysProvider } from './context/HotkeysContext';
import LoadingText from './ui/LoadingText';
import AddNoteView from './views/AddNoteView';
import SelectServiceView from './views/SelectServiceView';

interface AppProps {
  hotkeys: LabeledHotkeys;
  services: ServiceRegistry;
}

const App: FC<AppProps> = ({ hotkeys, services }) => {
  const dispatch = useDispatch();

  const serviceId = useSelector(selectServiceId);

  useEffect(() => {
    return window.app.onServicesChange(services => {
      dispatch(serviceChange(services.activeServiceId));
    });
  });

  const { isInitializing, service } = useInitializeService(services, serviceId);

  const overlayView = useSelector(selectOverlayView);

  return (
    <HotkeysProvider hotkeys={hotkeys}>
      <DialActionsProvider>
        <Layout>
          {service ? (
            <ServiceProvider service={service}>
              {overlayView && <AddNoteView noteType={overlayView} />}
              <div className={cc({ [styles.contentHidden]: Boolean(overlayView) })}>
                <Routes />
              </div>
            </ServiceProvider>
          ) : isInitializing ? (
            <LoadingText />
          ) : (
            <SelectServiceView services={services} />
          )}
        </Layout>
      </DialActionsProvider>
    </HotkeysProvider>
  );
};

export default App;
