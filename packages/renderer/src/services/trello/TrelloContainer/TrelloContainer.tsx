import { CacheProvider } from '@/shared/context/CacheContext';
import { Cache, ServiceContainer } from '@domain';
import { AxiosError } from 'axios';
import { ErrorBoundary } from 'react-error-boundary';
import { QueryErrorResetBoundary } from 'react-query';
import { TRELLO_API_URL } from '../constants';
import { TrelloCache } from '../domain';
import TrelloAuthError from './TrelloAuthError';
import TrelloServerError from './TrelloServerError';

interface TrelloContainerProps {
  cache: Cache<TrelloCache>;
}

const TrelloContainer: ServiceContainer<TrelloContainerProps> = ({ cache, children }) => {
  return (
    <CacheProvider cache={cache}>
      <QueryErrorResetBoundary>
        {({ reset }) => (
          <ErrorBoundary
            fallbackRender={({ error, resetErrorBoundary }) => {
              if (error instanceof AxiosError && error.config.baseURL === TRELLO_API_URL) {
                if (error.response?.status === 401 || error.response?.data === 'invalid token') {
                  return <TrelloAuthError error={error} onTokenSet={resetErrorBoundary} />;
                }

                return <TrelloServerError error={error} onRetry={resetErrorBoundary} />;
              }

              // We don't know what to do with the error, so let the error pass.
              throw error;
            }}
            onReset={reset}
          >
            {children}
          </ErrorBoundary>
        )}
      </QueryErrorResetBoundary>
    </CacheProvider>
  );
};

export default TrelloContainer;
