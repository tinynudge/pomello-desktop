import useCurrentTask from '@/app/hooks/useCurrentTask';
import useShowAddNoteView from '@/app/hooks/useShowAddNoteView';
import Heading from '@/app/ui/Heading';
import Text from '@/app/ui/Text';
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
    <>
      {getTaskHeading && <Heading>{getTaskHeading()}</Heading>}
      <Text>{currentTaskLabel}</Text>
    </>
  );
};

export default TaskView;
