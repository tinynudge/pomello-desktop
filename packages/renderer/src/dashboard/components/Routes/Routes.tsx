import { KeyboardShortcutsView } from '@/dashboard/views/KeyboardShortcutsView';
import { SettingsView } from '@/dashboard/views/SettingsView';
import { SoundsView } from '@/dashboard/views/SoundsView';
import { useTranslate } from '@/shared/context/RuntimeContext';
import { DashboardRoute } from '@pomello-desktop/domain';
import { Route } from '@solidjs/router';
import { Component, For } from 'solid-js';
import { MainHeader } from '../MainHeader';

export const Routes: Component = () => {
  const t = useTranslate();

  const routes: Record<DashboardRoute, string> = {
    [DashboardRoute.KeyboardShortcuts]: t('routeKeyboardShortcuts'),
    [DashboardRoute.Productivity]: t('routeProductivity'),
    [DashboardRoute.Profile]: t('routeProfile'),
    [DashboardRoute.Services]: t('routeServices'),
    [DashboardRoute.Settings]: t('routeSettings'),
    [DashboardRoute.Sounds]: t('routeSounds'),
  };

  return (
    <>
      <Route path={DashboardRoute.KeyboardShortcuts} component={KeyboardShortcutsView} />
      <Route path={DashboardRoute.Settings} component={SettingsView} />
      <Route path={DashboardRoute.Sounds} component={SoundsView} />
      <For each={Object.values(DashboardRoute)}>
        {route => <Route path={route} component={() => <MainHeader heading={routes[route]} />} />}
      </For>
    </>
  );
};
