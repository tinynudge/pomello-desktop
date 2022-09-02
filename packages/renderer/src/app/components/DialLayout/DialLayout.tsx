import { selectPomelloState } from '@/app/appSlice';
import { FC, ReactNode } from 'react';
import { useSelector } from 'react-redux';
import Dial from './Dial';
import styles from './DialLayout.module.scss';

interface DialLayoutProps {
  children: ReactNode;
}

const DialLayout: FC<DialLayoutProps> = ({ children }) => {
  const { timer } = useSelector(selectPomelloState);

  return (
    <div className={styles.container}>
      <div className={styles.content}>{children}</div>
      {timer && <Dial key={timer.type} timer={timer} />}
    </div>
  );
};

export default DialLayout;
