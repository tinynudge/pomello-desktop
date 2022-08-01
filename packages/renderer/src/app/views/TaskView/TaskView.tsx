import { selectPomelloState } from '@/app/appSlice';
import { FC } from 'react';
import { useSelector } from 'react-redux';

const TaskView: FC = () => {
  const { currentTaskId } = useSelector(selectPomelloState);

  return <div>Task: {currentTaskId}</div>;
};

export default TaskView;
