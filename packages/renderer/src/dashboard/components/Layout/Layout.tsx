import { useDashboard } from '@/dashboard/context/DashboardContext';
import { usePomelloConfig, useTranslate } from '@/shared/context/RuntimeContext';
import { Error } from '@/ui/dashboard/Error';
import { DashboardRoute } from '@pomello-desktop/domain';
import { A } from '@solidjs/router';
import { nanoid } from 'nanoid';
import { ErrorBoundary, For, ParentComponent, Show } from 'solid-js';
import { SaveChangesBanner } from '../SaveChangesBanner';
import { AccountDetails } from './AccountDetails';
import styles from './Layout.module.scss';
import { LoggedOutText } from './LoggedOutText';
import { PremiumFeatureModal } from './PremiumFeatureModal';

export const saveSettingsBannerId = `save-settings-banner-${nanoid()}`;

export const Layout: ParentComponent = props => {
  const { store } = usePomelloConfig();
  const { clearStagedSettings, commitStagedSettings, getHasStagedChanges } = useDashboard();
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
      <main class={styles.main}>
        <ErrorBoundary
          fallback={(error, resetErrorBoundary) => (
            <div class={styles.error}>
              <Error error={error} retry={resetErrorBoundary} />
            </div>
          )}
        >
          <div class={styles.content}>{props.children}</div>
          <div class={styles.saveChangesBanner} id={saveSettingsBannerId} />
          <Show when={getHasStagedChanges()}>
            <SaveChangesBanner
              onSaveClick={commitStagedSettings}
              onUndoClick={clearStagedSettings}
            />
          </Show>
        </ErrorBoundary>
      </main>
      <PremiumFeatureModal />
    </div>
  );
};
