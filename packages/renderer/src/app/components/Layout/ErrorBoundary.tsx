import { ServiceContainer } from '@/shared/components/ServiceContainer';
import { useRuntime } from '@/shared/context/RuntimeContext';
import { useMaybeService } from '@/shared/context/ServiceContext';
import { ErrorBoundary as BaseErrorBoundary, JSX, ParentComponent } from 'solid-js';
import { ErrorOverlay } from './ErrorOverlay';

type ErrorBoundaryProps = {
  renderError(children: JSX.Element): JSX.Element;
};

export const ErrorBoundary: ParentComponent<ErrorBoundaryProps> = props => {
  const { logger } = useRuntime();
  const getService = useMaybeService();

  return (
    <BaseErrorBoundary
      fallback={(error, resetErrorBoundary) => {
        const service = getService();
        const customFallback = service?.handleError?.({ error, resetErrorBoundary });

        logger.error('Caught error at error boundary', error);

        if (service && customFallback) {
          return props.renderError(<ServiceContainer>{customFallback()}</ServiceContainer>);
        }

        return props.renderError(
          <ErrorOverlay error={error} resetErrorBoundary={resetErrorBoundary} />
        );
      }}
    >
      {props.children}
    </BaseErrorBoundary>
  );
};
