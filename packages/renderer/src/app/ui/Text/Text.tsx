import { FC, ReactNode } from 'react';
import styles from './Text.module.scss';

interface TextProps {
  children: ReactNode;
}

const Text: FC<TextProps> = ({ children }) => {
  return <div className={styles.text}>{children}</div>;
};

export default Text;
