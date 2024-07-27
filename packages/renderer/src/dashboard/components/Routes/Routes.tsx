import { useTranslate } from '@/shared/context/RuntimeContext';
import { DashboardRoute } from '@pomello-desktop/domain';
import { Route } from '@solidjs/router';
import { Component, For } from 'solid-js';

export const Routes: Component = () => {
  const t = useTranslate();

  const routes: Record<DashboardRoute, string> = {
    [DashboardRoute.KeyboardShortcuts]: t('dashboardMenuKeyboardShortcuts'),
    [DashboardRoute.Productivity]: t('dashboardMenuProductivity'),
    [DashboardRoute.Profile]: t('dashboardMenuProfile'),
    [DashboardRoute.Services]: t('dashboardMenuServices'),
    [DashboardRoute.Settings]: t('dashboardMenuSettings'),
    [DashboardRoute.Sounds]: t('dashboardMenuSounds'),
  };

  return (
    <For each={Object.values(DashboardRoute)}>
      {route => <Route path={route} component={() => <h1>{routes[route]}</h1>} />}
    </For>
  );
};
