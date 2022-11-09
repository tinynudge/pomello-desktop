import { AxiosError } from 'axios';
import produce from 'immer';

const sanitizeTrelloError = (error: unknown) => {
  if (!(error instanceof AxiosError)) {
    return error;
  }

  const details = error.response ?? error.toJSON();

  return produce<any>(details, draft => {
    if (draft.config?.params?.token) {
      draft.config.params.token = '******';
    }
  });
};

export default sanitizeTrelloError;
