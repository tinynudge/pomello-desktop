import { useTranslate } from '@/shared/context/RuntimeContext';
import { Component } from 'solid-js';
import styles from './Menu.module.scss';
import AddIcon from './assets/add.svg';
import CogIcon from './assets/cog.svg';
import HomeIcon from './assets/home.svg';

type MenuProps = {
  isOpen: boolean;
  onCreateTaskClick(): void;
  onHomeClick(): void;
  onSettingsClick(): void;
  ref: HTMLElement;
};

export const Menu: Component<MenuProps> = props => {
  const t = useTranslate();

  return (
    <nav aria-label={t('menuLabel')} class={styles.menu} ref={props.ref}>
      <button
        aria-label={t('homeButtonLabel')}
        class={styles.button}
        inert={!props.isOpen}
        onClick={() => props.onHomeClick()}
      >
        <HomeIcon aria-hidden />
      </button>
      <button
        aria-label={t('settingsButtonLabel')}
        class={styles.button}
        inert={!props.isOpen}
        onClick={() => props.onSettingsClick()}
      >
        <CogIcon aria-hidden />
      </button>
      <button
        aria-label={t('createTaskButtonLabel')}
        class={styles.button}
        inert={!props.isOpen}
        onClick={() => props.onCreateTaskClick()}
      >
        <AddIcon aria-hidden />
      </button>
    </nav>
  );
};
