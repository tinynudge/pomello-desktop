import { selectTimer } from '@/app/appSlice';
import { FC } from 'react';
import { useSelector } from 'react-redux';
import DialContent from './DialContent';

const Dial: FC = () => {
  const timer = useSelector(selectTimer);

  return timer ? <DialContent key={timer.type} timer={timer} /> : null;
};

export default Dial;
