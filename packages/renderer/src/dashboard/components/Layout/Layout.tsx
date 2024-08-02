import { usePomelloConfig, useTranslate } from '@/shared/context/RuntimeContext';
import { DashboardRoute } from '@pomello-desktop/domain';
import { A } from '@solidjs/router';
import { For, ParentComponent, Show } from 'solid-js';
import { AccountDetails } from './AccountDetails';
import styles from './Layout.module.scss';
import { LoggedOutText } from './LoggedOutText';

export const Layout: ParentComponent = props => {
  const { store } = usePomelloConfig();
  const t = useTranslate();

  const routes: [DashboardRoute, label: string][] = [
    [DashboardRoute.Productivity, t('routeProductivity')],
    [DashboardRoute.Settings, t('routeSettings')],
    [DashboardRoute.Sounds, t('routeSounds')],
    [DashboardRoute.KeyboardShortcuts, t('routeKeyboardShortcuts')],
    [DashboardRoute.Services, t('routeServices')],
  ];

  return (
    <div class={styles.layout}>
      <div class={styles.sidebar}>
        <nav aria-label={t('menuLabel')} class={styles.menu}>
          <ul>
            <For each={routes}>
              {([route, label]) => (
                <li>
                  <A activeClass={styles.active} href={`/${route}`}>
                    {label}
                  </A>
                </li>
              )}
            </For>
          </ul>
        </nav>
        <div data-testid="account-details">
          <Show fallback={<LoggedOutText />} when={store.user}>
            {getUser => <AccountDetails user={getUser()} />}
          </Show>
        </div>
      </div>
      <main class={styles.content}>{props.children}</main>
    </div>
  );
};
