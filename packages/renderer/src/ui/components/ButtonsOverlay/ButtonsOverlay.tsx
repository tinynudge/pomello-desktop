import { For, JSX, ParentComponent } from 'solid-js';
import { Content } from '../Content/Content';
import styles from './ButtonsOverlay.module.scss';

interface ButtonsOverlayProps {
  buttons: Button[];
}

interface Button {
  content: JSX.Element;
  onClick(): void;
  title?: string;
}

export const ButtonsOverlay: ParentComponent<ButtonsOverlayProps> = props => {
  return (
    <div class={styles.buttonsOverlay}>
      <Content class={styles.content}>{props.children}</Content>
      <div class={styles.buttons}>
        <For each={props.buttons}>
          {button => (
            <button onClick={button.onClick} title={button.title}>
              {button.content}
            </button>
          )}
        </For>
      </div>
    </div>
  );
};
