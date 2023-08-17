import { dialActionsSet, dialActionsUnset, selectCurrentTaskId } from '@/app/appSlice';
import Heading from '@/app/ui/Heading';
import useTranslation from '@/shared/hooks/useTranslation';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import NextTaskHeading from './NextTaskHeading';

interface BreakViewProps {
  type: 'SHORT_BREAK' | 'LONG_BREAK';
}

const BreakView: FC<BreakViewProps> = ({ type }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const currentTaskId = useSelector(selectCurrentTaskId);

  useEffect(() => {
    dispatch(dialActionsSet(['skipTimer']));

    return () => {
      dispatch(dialActionsUnset());
    };
  }, [dispatch]);

  const breakMessageKey = type === 'SHORT_BREAK' ? 'shortBreakMessage' : 'longBreakMessage';

  return (
    <>
      {currentTaskId ? <NextTaskHeading /> : <Heading>{t('newTaskHeading')}</Heading>}
      <p>{t(breakMessageKey)}</p>
    </>
  );
};

export default BreakView;
