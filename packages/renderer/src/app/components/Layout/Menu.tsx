import useTranslation from '@/shared/hooks/useTranslation';
import { forwardRef } from 'react';
import { ReactComponent as AddIcon } from './assets/add.svg';
import { ReactComponent as CogIcon } from './assets/cog.svg';
import { ReactComponent as HomeIcon } from './assets/home.svg';
import styles from './Menu.module.scss';

interface MenuProps {
  isOpen: boolean;
  onHomeClick(): void;
}

const Menu = forwardRef<HTMLElement, MenuProps>(({ isOpen, onHomeClick }, ref) => {
  const { t } = useTranslation();

  return (
    <nav aria-label={t('menuLabel')} className={styles.menu} ref={ref}>
      <button
        aria-hidden={!isOpen}
        aria-label={t('homeButtonLabel')}
        className={styles.button}
        onClick={onHomeClick}
        tabIndex={isOpen ? 0 : -1}
      >
        <HomeIcon aria-hidden />
      </button>
      <button
        aria-label={t('dashboardButtonLabel')}
        aria-hidden={!isOpen}
        className={styles.button}
        tabIndex={isOpen ? 0 : -1}
      >
        <CogIcon aria-hidden />
      </button>
      <button
        aria-label={t('createTaskButtonLabel')}
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
