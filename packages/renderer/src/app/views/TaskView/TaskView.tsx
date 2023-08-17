import { dialActionsSet, dialActionsUnset } from '@/app/appSlice';
import useCurrentTask from '@/app/hooks/useCurrentTask';
import Heading from '@/app/ui/Heading';
import Text from '@/app/ui/Text';
import useService from '@/shared/hooks/useService';
import { FC, useEffect } from 'react';
import { useDispatch } from 'react-redux';

const TaskView: FC = () => {
  const dispatch = useDispatch();
  const { getTaskHeading } = useService();

  const { currentTaskLabel } = useCurrentTask();

  useEffect(() => {
    dispatch(dialActionsSet(['pauseTimer', 'addNote', 'switchTask', 'voidTask', 'completeTask']));

    return () => {
      dispatch(dialActionsUnset());
    };
  }, [dispatch]);

  return (
    <>
      {getTaskHeading && <Heading>{getTaskHeading()}</Heading>}
      <Text>{currentTaskLabel}</Text>
    </>
  );
};

export default TaskView;
