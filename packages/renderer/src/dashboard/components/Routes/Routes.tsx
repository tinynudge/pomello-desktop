import { KeyboardShortcutsView } from '@/dashboard/views/KeyboardShortcutsView';
import { ProductivityView } from '@/dashboard/views/ProductivityView';
import { ServicesView, ServiceView } from '@/dashboard/views/ServicesView';
import { SettingsView } from '@/dashboard/views/SettingsView';
import { SoundsView } from '@/dashboard/views/SoundsView';
import { useTranslate } from '@/shared/context/RuntimeContext';
import { ServiceProvider } from '@/shared/context/ServiceContext';
import { DashboardRoute } from '@pomello-desktop/domain';
import { Route } from '@solidjs/router';
import { Component } from 'solid-js';
import { MainHeader } from '../MainHeader';

export const Routes: Component = () => {
  const t = useTranslate();

  return (
    <>
      <Route path={DashboardRoute.Productivity} component={ProductivityView} />
      <Route path={DashboardRoute.KeyboardShortcuts} component={KeyboardShortcutsView} />
      <Route path={DashboardRoute.Settings} component={SettingsView} />
      <Route path={DashboardRoute.Sounds} component={SoundsView} />
      <Route path={DashboardRoute.Services}>
        <Route path="/" component={ServicesView} />
        <Route
          path={'/:serviceId'}
          component={props => (
            <ServiceProvider initialServiceId={props.params.serviceId} freezeServiceId>
              <ServiceView />
            </ServiceProvider>
          )}
        />
      </Route>
      <Route
        path={DashboardRoute.Profile}
        component={() => <MainHeader heading={t('routeProfile')} />}
      />
    </>
  );
};
