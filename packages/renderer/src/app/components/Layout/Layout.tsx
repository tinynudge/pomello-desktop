import cc from 'classcat';
import { FC, ReactNode, useRef, useState } from 'react';
import Menu from '../Menu';
import { ReactComponent as MenuIcon } from './assets/menu.svg';
import styles from './Layout.module.scss';

interface LayoutProps {
  children: ReactNode;
}

const Layout: FC<LayoutProps> = ({ children }) => {
  const menuRef = useRef<HTMLElement>(null);
  const [menuOffset, setMenuOffset] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleMenuClick = () => {
    setMenuOffset(menuRef.current?.getBoundingClientRect().width ?? 0);
    setIsMenuOpen(prevIsMenuOpen => !prevIsMenuOpen);
  };

  return (
    <>
      <Menu isOpen={isMenuOpen} ref={menuRef} />
      <main
        className={cc({
          [styles.container]: true,
          [styles.menuOpen]: isMenuOpen,
        })}
        style={{
          transform: isMenuOpen && menuOffset ? `translate(${menuOffset}px)` : undefined,
        }}
      >
        {/* TODO: Translate aria-label */}
        <button
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          className={styles.menuButton}
          onClick={handleMenuClick}
        >
          <MenuIcon aria-hidden width={4} />
        </button>
        <div className={styles.content}>{children}</div>
      </main>
    </>
  );
};

export default Layout;
