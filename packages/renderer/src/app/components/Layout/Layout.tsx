import { selectPomelloState } from '@/app/appSlice';
import useTranslation from '@/shared/hooks/useTranslation';
import cc from 'classcat';
import { FC, ReactNode, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import Dial from '../Dial';
import Menu from '../Menu';
import { ReactComponent as MenuIcon } from './assets/menu.svg';
import styles from './Layout.module.scss';

interface LayoutProps {
  children: ReactNode;
}

const Layout: FC<LayoutProps> = ({ children }) => {
  const { t } = useTranslation();

  const { timer } = useSelector(selectPomelloState);

  const menuRef = useRef<HTMLElement>(null);
  const [menuOffset, setMenuOffset] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleMenuClick = () => {
    if (menuRef.current) {
      setMenuOffset(menuRef.current.getBoundingClientRect().width);
    }

    setIsMenuOpen(prevIsMenuOpen => !prevIsMenuOpen);
  };

  const hasActiveTimer = timer && (timer.isActive || timer.isPaused);

  return (
    <>
      <Menu isOpen={isMenuOpen} ref={menuRef} />
      <main
        className={cc({
          [styles.container]: true,
          [styles.menuOpen]: isMenuOpen,
        })}
        data-mode={hasActiveTimer ? timer.type : undefined}
        style={{
          transform: isMenuOpen && menuOffset ? `translate(${menuOffset}px)` : undefined,
        }}
      >
        <button
          aria-label={isMenuOpen ? t('closeMenuLabel') : t('openMenuLabel')}
          className={styles.menuButton}
          onClick={handleMenuClick}
        >
          <MenuIcon aria-hidden width={4} />
        </button>
        <div className={styles.content}>{children}</div>
        {timer && <Dial timer={timer} />}
      </main>
    </>
  );
};

export default Layout;
