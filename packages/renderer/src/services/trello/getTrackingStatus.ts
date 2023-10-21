import { TrelloRuntime } from './TrelloRuntime';

const getTrackingStatus = ({ cache }: TrelloRuntime): boolean => {
  return cache.get().preferences.trackStats === true;
};

export default getTrackingStatus;
