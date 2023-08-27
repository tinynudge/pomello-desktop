import { TrelloRuntime } from './TrelloRuntime';
import getTrelloClient from './getTrelloClient';

const onTrelloServiceMount = ({ cache }: TrelloRuntime) => {
  let previousToken: string | undefined = undefined;

  const removeCacheSubscription = cache.subscribe(({ token }) => {
    if (token === previousToken) {
      return;
    }

    if (token) {
      getTrelloClient().setToken(token);
    } else {
      getTrelloClient().unsetToken();
    }

    previousToken = token;
  });

  return () => {
    removeCacheSubscription();
  };
};

export default onTrelloServiceMount;
