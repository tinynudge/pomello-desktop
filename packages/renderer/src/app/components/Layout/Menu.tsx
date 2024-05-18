import { useTranslate } from '@/shared/context/RuntimeContext';
import { Component } from 'solid-js';
import styles from './Menu.module.scss';
import AddIcon from './assets/add.svg';
import CogIcon from './assets/cog.svg';
import HomeIcon from './assets/home.svg';

interface MenuProps {
  isOpen: boolean;
  onCreateTaskClick(): void;
  onHomeClick(): void;
  ref: HTMLElement;
}

export const Menu: Component<MenuProps> = props => {
  const t = useTranslate();

  return (
    <nav aria-label={t('menuLabel')} class={styles.menu} ref={props.ref}>
      <button
        aria-hidden={!props.isOpen}
        aria-label={t('homeButtonLabel')}
        class={styles.button}
        onClick={() => props.onHomeClick()}
        tabIndex={props.isOpen ? 0 : -1}
      >
        <HomeIcon aria-hidden />
      </button>
      <button
        aria-label={t('dashboardButtonLabel')}
        aria-hidden={!props.isOpen}
        class={styles.button}
        tabIndex={props.isOpen ? 0 : -1}
      >
        <CogIcon aria-hidden />
      </button>
      <button
        aria-hidden={!props.isOpen}
        aria-label={t('createTaskButtonLabel')}
        class={styles.button}
        onClick={() => props.onCreateTaskClick()}
        tabIndex={props.isOpen ? 0 : -1}
      >
        <AddIcon aria-hidden />
      </button>
    </nav>
  );
};
