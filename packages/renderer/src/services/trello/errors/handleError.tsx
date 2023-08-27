import SerializableHttpError from '@/shared/helpers/SerializableHttpError';
import { ErrorHandler } from '@domain';
import { TRELLO_API_URL } from '../constants';
import TrelloAuthError from './TrelloAuthError';
import TrelloServerError from './TrelloServerError';

const isHttpError = (error: Error): error is SerializableHttpError => {
  return error instanceof SerializableHttpError;
};

const handleError: ErrorHandler = ({ error, resetErrorBoundary }) => {
  if (!isHttpError(error) || error.options.prefixUrl !== TRELLO_API_URL) {
    return;
  }

  if (error.response.status === 401 || error.message === 'invalid token') {
    return <TrelloAuthError error={error} onTokenSet={resetErrorBoundary} />;
  }

  return <TrelloServerError error={error} onRetry={resetErrorBoundary} />;
};

export default handleError;
