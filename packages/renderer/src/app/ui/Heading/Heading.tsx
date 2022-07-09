import { FC, ReactNode } from 'react';
import styles from './Heading.module.scss';

interface HeadingProps {
  children: ReactNode;
}

const Heading: FC<HeadingProps> = ({ children }) => {
  return <h1 className={styles.heading}>{children}</h1>;
};

export default Heading;
