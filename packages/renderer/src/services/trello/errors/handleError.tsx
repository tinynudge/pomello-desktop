import { ErrorHandler } from '@domain';
import { AxiosError } from 'axios';
import { TRELLO_API_URL } from '../constants';
import TrelloAuthError from './TrelloAuthError';
import TrelloServerError from './TrelloServerError';

const isAxiosError = (error: Error): error is AxiosError => {
  return error instanceof AxiosError;
};

const handleError: ErrorHandler = ({ error, resetErrorBoundary }) => {
  if (!isAxiosError(error) || error.config.baseURL !== TRELLO_API_URL) {
    return;
  }

  if (error.response?.status === 401 || error.response?.data === 'invalid token') {
    return <TrelloAuthError error={error} onTokenSet={resetErrorBoundary} />;
  }

  return <TrelloServerError error={error} onRetry={resetErrorBoundary} />;
};

export default handleError;
