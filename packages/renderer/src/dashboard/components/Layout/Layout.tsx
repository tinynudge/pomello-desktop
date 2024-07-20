import { usePomelloConfig, useTranslate } from '@/shared/context/RuntimeContext';
import { Translate } from '@/ui/shared/Translate';
import { DashboardRoute } from '@pomello-desktop/domain';
import { A } from '@solidjs/router';
import { For, ParentComponent, Show } from 'solid-js';
import styles from './Layout.module.scss';

export const Layout: ParentComponent = props => {
  const { store } = usePomelloConfig();
  const t = useTranslate();

  const handleAuthButtonClick = (action: 'authorize' | 'register') => {
    window.app.showAuthWindow({
      type: 'pomello',
      action,
    });
  };

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
        <nav aria-label={t('dashboardMenuLabel')} class={styles.menu}>
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
        <div class={styles.accountDetails} data-testid="account-details">
          <Show
            fallback={
              <Translate
                components={{
                  logIn: props => (
                    <button
                      class={styles.button}
                      onClick={() => handleAuthButtonClick('authorize')}
                    >
                      {props.children}
                    </button>
                  ),
                  signUp: props => (
                    <button class={styles.button} onClick={() => handleAuthButtonClick('register')}>
                      {props.children}
                    </button>
                  ),
                }}
                key="trackProductivityMessage"
              />
            }
            when={store.user}
          >
            {getUser => (
              <>
                <span class={styles.badge} data-type={getUser().type}>
                  {t(`${getUser().type}AccountLabel`)}
                </span>
                <p>{getUser().name}</p>
                <p>{getUser().email}</p>
              </>
            )}
          </Show>
        </div>
      </div>
      <section class={styles.content}>{props.children}</section>
    </div>
  );
};
