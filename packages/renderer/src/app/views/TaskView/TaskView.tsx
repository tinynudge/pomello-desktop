import DialLayout from '@/app/components/DialLayout';
import useCurrentTask from '@/app/hooks/useCurrentTask';
import useShowAddNoteView from '@/app/hooks/useShowAddNoteView';
import Heading from '@/app/ui/Heading';
import useService from '@/shared/hooks/useService';
import { FC } from 'react';
import useTaskDialActions from './useTaskDialActions';
import useTaskHotkeys from './useTaskHotkeys';

const TaskView: FC = () => {
  const { getTaskHeading } = useService();

  const showAddNoteView = useShowAddNoteView();

  useTaskHotkeys({ showAddNoteView });

  useTaskDialActions({ showAddNoteView });

  const { currentTaskLabel } = useCurrentTask();

  return (
    <DialLayout>
      {getTaskHeading && <Heading>{getTaskHeading()}</Heading>}
      <p>{currentTaskLabel}</p>
    </DialLayout>
  );
};

export default TaskView;
