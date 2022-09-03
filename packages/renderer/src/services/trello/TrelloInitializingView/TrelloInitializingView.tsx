import useServiceConfig from '@/shared/hooks/useServiceConfig';
import { InitializingView } from '@domain';
import { TrelloConfig } from '../TrelloConfig';
import LoginView from './LoginView';

const TrelloInitializingView: InitializingView = () => {
  const [trelloConfig] = useServiceConfig<TrelloConfig>();

  if (!trelloConfig.token) {
    return <LoginView />;
  }

  return null;
};

export default TrelloInitializingView;
