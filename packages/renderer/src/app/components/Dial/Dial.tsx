import { selectDial } from '@/app/appSlice';
import { FC } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import DialContent from './DialContent';

const Dial: FC = () => {
  const { isActive, isPaused, type } = useSelector(selectDial, shallowEqual);

  if (!type) {
    return null;
  }

  return <DialContent key={type} isActive={isActive} isPaused={isPaused} />;
};

export default Dial;
