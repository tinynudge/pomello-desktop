import { FC, ReactNode } from 'react';
import styles from './ButtonsLayout.module.scss';

interface ButtonsLayoutProps {
  buttons: Button[];
  children?: ReactNode;
}

interface Button {
  content: ReactNode;
  id: string;
  onClick(): void;
  title?: string;
}

const ButtonsLayout: FC<ButtonsLayoutProps> = ({ buttons, children }) => {
  return (
    <div className={styles.buttonsLayout}>
      <div className={styles.content}>{children}</div>
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

export default ButtonsLayout;
