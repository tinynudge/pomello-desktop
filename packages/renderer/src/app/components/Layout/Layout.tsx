import { selectAppMode, selectIsOvertimeVisible, selectIsTimerVisible } from '@/app/appSlice';
import useHotkeys from '@/app/hooks/useHotkeys';
import usePomelloActions from '@/app/hooks/usePomelloActions';
import createHintTitle from '@/shared/helpers/createHintTitle';
import useTranslation from '@/shared/hooks/useTranslation';
import { ActiveService, Logger } from '@domain';
import cc from 'classcat';
import { FC, ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import Dial from '../Dial';
import Overtime from '../Overtime';
import { ReactComponent as MenuIcon } from './assets/menu.svg';
import ErrorBoundary from './ErrorBoundary';
import selectShowCancelTaskDialog from './helpers/selectShowCancelTaskDialog';
import styles from './Layout.module.scss';
import Menu from './Menu';

interface LayoutProps {
  activeService?: ActiveService;
  children: ReactNode;
  logger: Logger;
  onTaskCreate(): void;
}

const Layout: FC<LayoutProps> = ({ activeService, children, logger, onTaskCreate }) => {
  const { t } = useTranslation();
  const { getHotkeyLabel, registerHotkeys } = useHotkeys();

  const { reset } = usePomelloActions();

  const appMode = useSelector(selectAppMode);
  const isDialVisible = useSelector(selectIsTimerVisible);
  const isOvertimeVisible = useSelector(selectIsOvertimeVisible);

  const showCancelTaskDialog = useSelector(selectShowCancelTaskDialog);

  const menuRef = useRef<HTMLElement>(null);
  const [menuOffset, setMenuOffset] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const createTask = useCallback(() => {
    onTaskCreate();
    setIsMenuOpen(false);
  }, [onTaskCreate]);

  const routeHome = useCallback(async () => {
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
    setIsMenuOpen(false);
  }, [reset, showCancelTaskDialog, t]);

  useEffect(() => {
    return registerHotkeys({
      createTask,
      routeHome,
      toggleMenu,
    });
  }, [createTask, registerHotkeys, routeHome]);

  const handleMenuClick = () => {
    toggleMenu();
  };

  const handleCreateTaskClick = () => {
    createTask();
  };

  const handleHomeButtonClick = () => {
    routeHome();
  };

  const toggleMenu = () => {
    if (menuRef.current) {
      setMenuOffset(menuRef.current.getBoundingClientRect().width);
    }

    setIsMenuOpen(prevIsMenuOpen => !prevIsMenuOpen);
  };

  const menuTranslationKey = isMenuOpen ? 'closeMenu' : 'openMenu';

  return (
    <>
      <Menu
        isOpen={isMenuOpen}
        onCreateTaskClick={handleCreateTaskClick}
        onHomeClick={handleHomeButtonClick}
        ref={menuRef}
      />
      <main
        className={cc({
          [styles.container]: true,
          [styles.menuOpen]: isMenuOpen,
        })}
        data-mode={appMode}
        style={{
          transform: isMenuOpen && menuOffset ? `translate(${menuOffset}px)` : undefined,
        }}
      >
        <button
          aria-label={t(`${menuTranslationKey}Label`)}
          className={styles.menuButton}
          onClick={handleMenuClick}
          title={createHintTitle(t, 'openMenuLabel', getHotkeyLabel('toggleMenu'))}
        >
          <MenuIcon aria-hidden width={4} />
        </button>
        <ErrorBoundary
          activeService={activeService}
          logger={logger}
          renderError={children => <div className={styles.content}>{children}</div>}
        >
          <div className={styles.content}>{children}</div>
          {(isDialVisible || isOvertimeVisible) && (
            <div className={styles.timers}>
              <Overtime />
              <Dial />
            </div>
          )}
        </ErrorBoundary>
      </main>
    </>
  );
};

export default Layout;
