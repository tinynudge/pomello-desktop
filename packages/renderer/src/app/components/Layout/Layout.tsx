import { selectPomelloState } from '@/app/appSlice';
import useHotkeys from '@/app/hooks/useHotkeys';
import useTranslation from '@/shared/hooks/useTranslation';
import cc from 'classcat';
import { FC, ReactNode, useEffect, useRef, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { useSelector } from 'react-redux';
import Dial from '../Dial';
import { ReactComponent as MenuIcon } from './assets/menu.svg';
import styles from './Layout.module.scss';
import Menu from './Menu';

interface LayoutProps {
  children: ReactNode;
}

const Layout: FC<LayoutProps> = ({ children }) => {
  const { t } = useTranslation();
  const { getHotkeyLabel, registerHotkeys } = useHotkeys();

  const { timer } = useSelector(selectPomelloState);

  const menuRef = useRef<HTMLElement>(null);
  const [menuOffset, setMenuOffset] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    return registerHotkeys({ toggleMenu });
  }, [registerHotkeys]);

  const handleMenuClick = () => {
    toggleMenu();
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
      <Menu isOpen={isMenuOpen} ref={menuRef} />
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
          {timer && <Dial key={timer.type} timer={timer} />}
        </ErrorBoundary>
      </main>
    </>
  );
};

export default Layout;
