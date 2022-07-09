import useService from '@/shared/hooks/useService';
import { ServiceRegistry } from '@domain';
import { FC } from 'react';
import { useSelector } from 'react-redux';
import { selectServiceId } from './appSlice';
import Layout from './components/Layout';
import Routes from './components/Routes';
import SelectServiceView from './views/SelectServiceView';

interface AppProps {
  services: ServiceRegistry;
}

const App: FC<AppProps> = ({ services }) => {
  const serviceId = useSelector(selectServiceId);
  const service = useService(services, serviceId);

  return (
    <Layout>
      {service ? <Routes service={service} /> : <SelectServiceView services={services} />}
    </Layout>
  );
};

export default App;
