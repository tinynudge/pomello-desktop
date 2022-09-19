import { selectPomelloState } from '@/app/appSlice';
import useHotkeys from '@/app/hooks/useHotkeys';
import usePomelloActions from '@/app/hooks/usePomelloActions';
import useTranslation from '@/shared/hooks/useTranslation';
import cc from 'classcat';
import { FC, ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { useSelector } from 'react-redux';
import Dial from '../Dial';
import Overtime from '../Overtime';
import { ReactComponent as MenuIcon } from './assets/menu.svg';
import selectShowCancelTaskDialog from './helpers/selectShowCancelTaskDialog';
import styles from './Layout.module.scss';
import Menu from './Menu';

interface LayoutProps {
  children: ReactNode;
}

const Layout: FC<LayoutProps> = ({ children }) => {
  const { t } = useTranslation();
  const { getHotkeyLabel, registerHotkeys } = useHotkeys();

  const { reset } = usePomelloActions();
  const { timer, overtime } = useSelector(selectPomelloState);
  const showCancelTaskDialog = useSelector(selectShowCancelTaskDialog);

  const menuRef = useRef<HTMLElement>(null);
  const [menuOffset, setMenuOffset] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
      toggleMenu,
      routeHome,
    });
  }, [registerHotkeys, routeHome]);

  const handleMenuClick = () => {
    toggleMenu();
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
      <Menu isOpen={isMenuOpen} onHomeClick={handleHomeButtonClick} ref={menuRef} />
      <main
        className={cc({
          [styles.container]: true,
          [styles.menuOpen]: isMenuOpen,
        })}
        data-mode={timer?.isActive ? timer.type : undefined}
        style={{
          transform: isMenuOpen && menuOffset ? `translate(${menuOffset}px)` : undefined,
        }}
      >
        <button
          aria-label={t(`${menuTranslationKey}Label`)}
          className={styles.menuButton}
          onClick={handleMenuClick}
          title={t(`${menuTranslationKey}Title`, { hotkey: getHotkeyLabel('toggleMenu') })}
        >
          <MenuIcon aria-hidden width={4} />
        </button>
        <ErrorBoundary fallback={<>TODO: Error handler</>}>
          <div className={styles.content}>{children}</div>
          {(timer || overtime) && (
            <div className={styles.timers}>
              {overtime && <Overtime isDialVisible={Boolean(timer)} overtime={overtime} />}
              {timer && <Dial key={timer.type} timer={timer} />}
            </div>
          )}
        </ErrorBoundary>
      </main>
    </>
  );
};

export default Layout;
