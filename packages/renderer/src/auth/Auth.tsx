import { ServiceProvider } from '@/shared/context/ServiceContext';
import useInitializeService from '@/shared/hooks/useInitializeService';
import { ServiceRegistry } from '@domain';
import { FC, useState } from 'react';
import styles from './Auth.module.scss';
import PomelloAuthView from './components/PomelloAuthView';
import SuccessMessage from './components/SuccessMessage';
import AuthViewProvider from './context/AuthViewProvider';

interface AuthProps {
  serviceId?: string;
  services: ServiceRegistry;
}

const Auth: FC<AuthProps> = ({ serviceId, services }) => {
  const [didSaveToken, setDidSaveToken] = useState(false);

  const { activeService } = useInitializeService(services, serviceId);

  const handleTokenSave = () => {
    setDidSaveToken(true);
  };

  return (
    <div className={styles.container}>
      {!didSaveToken ? (
        <AuthViewProvider onTokenSave={handleTokenSave}>
          {!serviceId ? (
            <PomelloAuthView />
          ) : activeService?.service?.AuthView ? (
            <ServiceProvider service={activeService}>
              <activeService.service.AuthView />
            </ServiceProvider>
          ) : null}
        </AuthViewProvider>
      ) : (
        <SuccessMessage />
      )}
    </div>
  );
};

export default Auth;
