import useService from '@/shared/hooks/useService';
import { LabeledHotkeys, ServiceRegistry } from '@domain';
import { FC } from 'react';
import { useSelector } from 'react-redux';
import { selectServiceId } from './appSlice';
import Layout from './components/Layout';
import Routes from './components/Routes';
import { DialActionsProvider } from './context/DialActionsContext';
import { HotkeysProvider } from './context/HotkeysContext';
import SelectServiceView from './views/SelectServiceView';

interface AppProps {
  hotkeys: LabeledHotkeys;
  services: ServiceRegistry;
}

const App: FC<AppProps> = ({ hotkeys, services }) => {
  const serviceId = useSelector(selectServiceId);
  const service = useService(services, serviceId);

  return (
    <HotkeysProvider hotkeys={hotkeys}>
      <DialActionsProvider>
        <Layout>
          {service ? <Routes service={service} /> : <SelectServiceView services={services} />}
        </Layout>
      </DialActionsProvider>
    </HotkeysProvider>
  );
};

export default App;
