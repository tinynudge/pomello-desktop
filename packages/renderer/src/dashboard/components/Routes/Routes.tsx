import { DashboardRoute } from '@pomello-desktop/domain';
import { Route } from '@solidjs/router';
import { Component, For } from 'solid-js';

export const Routes: Component = () => {
  return (
    <For each={Object.values(DashboardRoute)}>
      {route => <Route path={route} component={() => route} />}
    </For>
  );
};
