import { ServiceProvider } from '@/shared/context/ServiceContext';
import useInitializeService from '@/shared/hooks/useInitializeService';
import { AuthWindowType, Logger, ServiceRegistry, Settings } from '@domain';
import { FC, useState } from 'react';
import styles from './Auth.module.scss';
import PomelloAuthView from './components/PomelloAuthView';
import SuccessMessage from './components/SuccessMessage';
import AuthViewProvider from './context/AuthViewProvider';

interface AuthProps {
  authWindow: AuthWindowType;
  logger: Logger;
  services: ServiceRegistry;
  settings: Settings;
}

const Auth: FC<AuthProps> = ({ authWindow, logger, services, settings }) => {
  const [didSaveToken, setDidSaveToken] = useState(false);

  const serviceId = authWindow.type === 'service' ? authWindow.serviceId : undefined;
  const { activeService } = useInitializeService({ logger, services, serviceId, settings });

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
