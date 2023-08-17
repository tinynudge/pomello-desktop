import useMaybeService from '@/shared/hooks/useMaybeService';
import { Logger } from '@domain';
import { AxiosError } from 'axios';
import { FC, Fragment, ReactNode } from 'react';
import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary';
import { QueryErrorResetBoundary } from 'react-query';
import ErrorOverlay from './ErrorOverlay';

interface ErrorBoundaryProps {
  children: ReactNode;
  logger: Logger;
  renderError(children: ReactNode): JSX.Element;
}

const ErrorBoundary: FC<ErrorBoundaryProps> = ({ children, logger, renderError }) => {
  const service = useMaybeService();

  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ReactErrorBoundary
          fallbackRender={props => {
            const customFallback = service?.handleError?.(props);

            if (service && customFallback) {
              const ServiceContainer = service.Container ?? Fragment;

              return renderError(<ServiceContainer>{customFallback}</ServiceContainer>);
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
