import { FC, ReactNode } from 'react';
import Content from '../Content';
import styles from './ButtonsOverlay.module.scss';

interface ButtonsOverlayProps {
  buttons: Button[];
  children?: ReactNode;
}

interface Button {
  content: ReactNode;
  id: string;
  onClick(): void;
  title?: string;
}

const ButtonsOverlay: FC<ButtonsOverlayProps> = ({ buttons, children }) => {
  return (
    <div className={styles.buttonsOverlay}>
      <Content className={styles.content}>{children}</Content>
      <div className={styles.buttons}>
        {buttons.map(button => (
          <button key={button.id} onClick={button.onClick} title={button.title}>
            {button.content}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ButtonsOverlay;
