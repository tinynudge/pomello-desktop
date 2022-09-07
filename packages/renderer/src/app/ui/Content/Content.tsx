import cc from 'classcat';
import { FC, ReactNode } from 'react';
import styles from './Content.module.scss';

interface ContentProps {
  children: ReactNode;
  className?: string;
}

const Content: FC<ContentProps> = ({ children, className }) => {
  return <div className={cc([styles.content, className])}>{children}</div>;
};

export default Content;
