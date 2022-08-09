import Heading from '@/app/ui/Heading';
import { SelectOptionType } from '@domain';
import { FC } from 'react';
import useCurrentTask from './useCurrentTask';
import useTaskDialActions from './useTaskDialActions';
import useTaskHotkeys from './useTaskHotkeys';

interface TaskViewProps {
  getTaskHeading?(): string;
  getTaskLabel?(task: SelectOptionType): string;
  serviceId: string;
}

const TaskView: FC<TaskViewProps> = ({ getTaskHeading, getTaskLabel, serviceId }) => {
  useTaskHotkeys();

  useTaskDialActions();

  const currentTask = useCurrentTask(serviceId);

  return (
    <>
      {getTaskHeading && <Heading>{getTaskHeading()}</Heading>}
      <p>{getTaskLabel?.(currentTask) ?? currentTask.label}</p>
    </>
  );
};

export default TaskView;
