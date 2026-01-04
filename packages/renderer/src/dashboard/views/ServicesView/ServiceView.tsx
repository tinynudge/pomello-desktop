import { MainHeader } from '@/dashboard/components/MainHeader';
import { useMaybeService } from '@/shared/context/ServiceContext';
import { Component, Show } from 'solid-js';
import { Dynamic } from 'solid-js/web';

export const ServiceView: Component = () => {
  const getMaybeService = useMaybeService();

  return (
    <Show when={getMaybeService()}>
      {getService => (
        <>
          <MainHeader heading={getService().displayName} />
          <Show when={getService()?.ConfigureView}>
            {getConfigureView => <Dynamic component={getConfigureView()} />}
          </Show>
        </>
      )}
    </Show>
  );
};
