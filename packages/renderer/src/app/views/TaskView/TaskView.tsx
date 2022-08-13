import Heading from '@/app/ui/Heading';
import useService from '@/shared/hooks/useService';
import { FC } from 'react';
import useCurrentTask from './useCurrentTask';
import { useShowAddNoteView } from './useShowAddNoteView';
import useTaskDialActions from './useTaskDialActions';
import useTaskHotkeys from './useTaskHotkeys';

const TaskView: FC = () => {
  const { getTaskHeading, getTaskLabel } = useService();

  const showAddNoteView = useShowAddNoteView();

  useTaskHotkeys({ showAddNoteView });

  useTaskDialActions({ showAddNoteView });

  const currentTask = useCurrentTask();

  return (
    <>
      {getTaskHeading && <Heading>{getTaskHeading()}</Heading>}
      <p>{getTaskLabel?.(currentTask) ?? currentTask.label}</p>
    </>
  );
};

export default TaskView;
