import Heading from '@/app/ui/Heading';
import { Service } from '@domain';
import { FC } from 'react';
import useCurrentTask from './useCurrentTask';
import { useShowAddNoteView } from './useShowAddNoteView';
import useTaskDialActions from './useTaskDialActions';
import useTaskHotkeys from './useTaskHotkeys';

interface TaskViewProps {
  service: Service;
}

const TaskView: FC<TaskViewProps> = ({ service }) => {
  const showAddNoteView = useShowAddNoteView(service);

  useTaskHotkeys({ showAddNoteView });

  useTaskDialActions({ showAddNoteView });

  const currentTask = useCurrentTask(service.id);

  return (
    <>
      {service.getTaskHeading && <Heading>{service.getTaskHeading()}</Heading>}
      <p>{service.getTaskLabel?.(currentTask) ?? currentTask.label}</p>
    </>
  );
};

export default TaskView;
