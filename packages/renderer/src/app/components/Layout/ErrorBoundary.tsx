import { ServiceProvider } from '@/shared/context/ServiceContext';
import { ActiveService } from '@domain';
import { FC, Fragment, ReactNode } from 'react';
import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary';
import { QueryErrorResetBoundary } from 'react-query';

interface ErrorBoundaryProps {
  activeService?: ActiveService;
  children: ReactNode;
  renderError(children: ReactNode): JSX.Element;
}

const ErrorBoundary: FC<ErrorBoundaryProps> = ({ activeService, children, renderError }) => {
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

            return renderError('TODO: Error handler');
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
