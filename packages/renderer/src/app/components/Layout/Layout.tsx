import { useHotkeys } from '@/app/context/HotkeysContext';
import { usePomelloActions } from '@/app/context/PomelloContext';
import { useStore } from '@/app/context/StoreContext';
import { useSettings, useTranslate } from '@/shared/context/RuntimeContext';
import { DashboardRoute } from '@pomello-desktop/domain';
import { ParentComponent, batch, createSignal } from 'solid-js';
import { Dial } from '../Dial';
import { Overtime } from '../Overtime';
import { ErrorBoundary } from './ErrorBoundary';
import styles from './Layout.module.scss';
import { Menu } from './Menu';
import MenuIcon from './assets/menu.svg';

interface LayoutProps {
  onTaskCreate(): void;
}

export const Layout: ParentComponent<LayoutProps> = props => {
  const { getTitleWithHotkey, registerHotkeys } = useHotkeys();
  const { reset } = usePomelloActions();
  const settings = useSettings();
  const { pomelloState } = useStore();
  const t = useTranslate();

  let menuRef: HTMLElement;

  const [getMenuOffset, setMenuOffset] = createSignal(0);
  const [getIsMenuOpen, setIsMenuOpen] = createSignal(false);

  const getAppMode = () => (pomelloState.timer?.isActive ? pomelloState.timer.type : undefined);

  const getAreTimersVisible = () => Boolean(pomelloState.timer || pomelloState.overtime);

  const createTask = () => {
    props.onTaskCreate();
    hideMenu();
  };

  const openDashboard = (route: DashboardRoute) => {
    window.app.showDashboardWindow(route);

    hideMenu();
  };

  const routeHome = async () => {
    const showCancelTaskDialog =
      settings.warnBeforeTaskCancel &&
      pomelloState.timer?.isActive &&
      pomelloState.timer.type === 'TASK';

    if (showCancelTaskDialog) {
      const { response } = await window.app.showMessageBox({
        buttons: [t('cancelTaskDialogConfirm'), t('cancelTaskDialogCancel')],
        cancelId: 1,
        defaultId: 0,
        detail: t('cancelTaskDialogMessage'),
        message: t('cancelTaskDialogHeading'),
        title: 'Pomello',
        type: 'warning',
      });

      if (response === 1) {
        return;
      }
    }

    reset();
    hideMenu();
  };

  const toggleMenu = () => {
    batch(() => {
      setMenuOffset(!getIsMenuOpen() ? menuRef.getBoundingClientRect().width : 0);
      setIsMenuOpen(!getIsMenuOpen());
    });
  };

  const hideMenu = () => {
    if (getIsMenuOpen()) {
      toggleMenu();
    }
  };

  const handleMenuClick = () => {
    toggleMenu();
  };

  const handleSettingsClick = () => {
    openDashboard(DashboardRoute.Settings);
  };

  const handleCreateTaskClick = () => {
    createTask();
  };

  const handleHomeButtonClick = () => {
    routeHome();
  };

  registerHotkeys({
    createTask,
    routeHome,
    routeProductivity: () => openDashboard(DashboardRoute.Productivity),
    routeSettings: () => openDashboard(DashboardRoute.Settings),
    toggleMenu,
  });

  return (
    <>
      <Menu
        isOpen={getIsMenuOpen()}
        onCreateTaskClick={handleCreateTaskClick}
        onHomeClick={handleHomeButtonClick}
        onSettingsClick={handleSettingsClick}
        ref={menuRef!}
      />

      <main
        classList={{
          [styles.container]: true,
          [styles.menuOpen]: getIsMenuOpen(),
        }}
        data-mode={getAppMode()}
        style={{ transform: `translate(${getMenuOffset()}px)` }}
      >
        <button
          aria-label={getIsMenuOpen() ? t('closeMenuLabel') : t('openMenuLabel')}
          class={styles.menuButton}
          onClick={handleMenuClick}
          title={getTitleWithHotkey('openMenuLabel', 'toggleMenu')}
        >
          <MenuIcon aria-hidden width={4} />
        </button>
        <ErrorBoundary renderError={children => <div class={styles.content}>{children}</div>}>
          <div class={styles.content}>{props.children}</div>
          {getAreTimersVisible() && (
            <div class={styles.timers}>
              <Overtime />
              <Dial />
            </div>
          )}
        </ErrorBoundary>
      </main>
    </>
  );
};
