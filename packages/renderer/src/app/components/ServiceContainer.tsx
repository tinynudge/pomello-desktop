import { useMaybeService } from '@/shared/context/ServiceContext';
import { ParentComponent, Show } from 'solid-js';
import { Dynamic } from 'solid-js/web';

export const ServiceContainer: ParentComponent = props => {
  const getService = useMaybeService();

  return (
    <Show when={getService()?.Container} fallback={props.children}>
      <Dynamic component={getService()?.Container}>{props.children}</Dynamic>
    </Show>
  );
};
