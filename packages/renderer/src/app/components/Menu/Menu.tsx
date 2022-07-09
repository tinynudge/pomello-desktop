import { forwardRef } from 'react';
import { ReactComponent as AddIcon } from './assets/add.svg';
import { ReactComponent as CogIcon } from './assets/cog.svg';
import { ReactComponent as HomeIcon } from './assets/home.svg';
import styles from './Menu.module.scss';

interface MenuProps {
  isOpen: boolean;
}

const Menu = forwardRef<HTMLElement, MenuProps>(({ isOpen }, ref) => {
  /* TODO: Translate aria-label */
  return (
    <nav aria-label="Menu" className={styles.menu} ref={ref}>
      <button
        aria-label="Home"
        aria-hidden={!isOpen}
        className={styles.button}
        tabIndex={isOpen ? 0 : -1}
      >
        <HomeIcon aria-hidden />
      </button>
      <button
        aria-label="Dashboard"
        aria-hidden={!isOpen}
        className={styles.button}
        tabIndex={isOpen ? 0 : -1}
      >
        <CogIcon aria-hidden />
      </button>
      <button
        aria-label="Create task"
        aria-hidden={!isOpen}
        className={styles.button}
        tabIndex={isOpen ? 0 : -1}
      >
        <AddIcon aria-hidden />
      </button>
    </nav>
  );
});

export default Menu;
