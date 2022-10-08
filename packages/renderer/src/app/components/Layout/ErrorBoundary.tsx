import { ServiceProvider } from '@/shared/context/ServiceContext';
import { ActiveService, Logger } from '@domain';
import { AxiosError } from 'axios';
import { FC, Fragment, ReactNode } from 'react';
import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary';
import { QueryErrorResetBoundary } from 'react-query';
import ErrorOverlay from './ErrorOverlay';

interface ErrorBoundaryProps {
  activeService?: ActiveService;
  children: ReactNode;
  logger: Logger;
  renderError(children: ReactNode): JSX.Element;
}

const ErrorBoundary: FC<ErrorBoundaryProps> = ({
  activeService,
  children,
  logger,
  renderError,
}) => {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ReactErrorBoundary
          fallbackRender={props => {
            const customFallback = activeService?.service.handleError?.(props);

            if (activeService && customFallback) {
              const ServiceContainer = activeService.service.Container ?? Fragment;

              return renderError(
                <ServiceProvider service={activeService}>
                  <ServiceContainer>{customFallback}</ServiceContainer>
                </ServiceProvider>
              );
            }

            return renderError(<ErrorOverlay {...props} />);
          }}
          onError={error => {
            const message =
              error instanceof AxiosError
                ? error.toJSON()
                : { message: error.message, stack: error.stack };

            logger.error(JSON.stringify(message));
          }}
          onReset={reset}
        >
          {children}
        </ReactErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
};

export default ErrorBoundary;
