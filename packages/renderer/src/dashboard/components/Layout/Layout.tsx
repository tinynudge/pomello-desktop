import { useTranslate } from '@/shared/context/RuntimeContext';
import { DashboardRoute } from '@pomello-desktop/domain';
import { A } from '@solidjs/router';
import { For, ParentComponent } from 'solid-js';
import styles from './Layout.module.scss';

export const Layout: ParentComponent = props => {
  const t = useTranslate();

  const routes: [DashboardRoute, label: string][] = [
    [DashboardRoute.Productivity, t('dashboardMenuProductivity')],
    [DashboardRoute.Settings, t('dashboardMenuSettings')],
    [DashboardRoute.Sounds, t('dashboardMenuSounds')],
    [DashboardRoute.KeyboardShortcuts, t('dashboardMenuKeyboardShortcuts')],
    [DashboardRoute.Services, t('dashboardMenuServices')],
  ];

  return (
    <div class={styles.layout}>
      <div class={styles.sidebar}>
        <nav aria-label={t('dashboardMenuLabel')}>
          <ul class={styles.menu}>
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
      </div>
      <section class={styles.content}>{props.children}</section>
    </div>
  );
};
