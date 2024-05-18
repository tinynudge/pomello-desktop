import { LoadingText } from '@/ui/components/LoadingText';
import { InitializingView } from '@pomello-desktop/domain';

export const MockInitializingView: InitializingView = props => {
  setTimeout(() => {
    props.onReady();
  }, 300);

  return <LoadingText />;
};
