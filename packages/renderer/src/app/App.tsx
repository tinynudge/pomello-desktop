import useService from '@/shared/hooks/useService';
import { LabeledHotkeys, ServiceRegistry } from '@domain';
import cc from 'classcat';
import { FC } from 'react';
import { useSelector } from 'react-redux';
import styles from './App.module.scss';
import { selectOverlayView, selectServiceId } from './appSlice';
import Layout from './components/Layout';
import Routes from './components/Routes';
import { DialActionsProvider } from './context/DialActionsContext';
import { HotkeysProvider } from './context/HotkeysContext';
import AddNoteView from './views/AddNoteView';
import SelectServiceView from './views/SelectServiceView';

interface AppProps {
  hotkeys: LabeledHotkeys;
  services: ServiceRegistry;
}

const App: FC<AppProps> = ({ hotkeys, services }) => {
  const serviceId = useSelector(selectServiceId);
  const service = useService(services, serviceId);

  const overlayView = useSelector(selectOverlayView);

  return (
    <HotkeysProvider hotkeys={hotkeys}>
      <DialActionsProvider>
        <Layout>
          {service ? (
            <>
              {overlayView && <AddNoteView noteType={overlayView} service={service} />}
              <div className={cc({ [styles.contentHidden]: Boolean(overlayView) })}>
                <Routes service={service} />
              </div>
            </>
          ) : (
            <SelectServiceView services={services} />
          )}
        </Layout>
      </DialActionsProvider>
    </HotkeysProvider>
  );
};

export default App;
