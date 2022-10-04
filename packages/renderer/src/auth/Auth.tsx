import { ServiceProvider } from '@/shared/context/ServiceContext';
import useInitializeService from '@/shared/hooks/useInitializeService';
import { AuthWindowType, ServiceRegistry } from '@domain';
import { FC, useState } from 'react';
import styles from './Auth.module.scss';
import PomelloAuthView from './components/PomelloAuthView';
import SuccessMessage from './components/SuccessMessage';
import AuthViewProvider from './context/AuthViewProvider';

interface AuthProps {
  authWindow: AuthWindowType;
  services: ServiceRegistry;
}

const Auth: FC<AuthProps> = ({ authWindow, services }) => {
  const [didSaveToken, setDidSaveToken] = useState(false);

  const serviceId = authWindow.type === 'service' ? authWindow.serviceId : undefined;
  const { activeService } = useInitializeService(services, serviceId);

  const handleTokenSave = () => {
    setDidSaveToken(true);
  };

  return (
    <div className={styles.container}>
      {!didSaveToken ? (
        <AuthViewProvider onTokenSave={handleTokenSave}>
          {authWindow.type === 'pomello' ? (
            <PomelloAuthView action={authWindow.action} />
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
