import { selectPomelloState } from '@/app/appSlice';
import usePomelloActions from '@/app/hooks/usePomelloActions';
import { CustomTaskTimerEndOption, TaskTimerEndActionType } from '@domain';
import { FC } from 'react';
import { useSelector } from 'react-redux';

interface TaskTimerEndViewProps {
  getCustomOptions?(): CustomTaskTimerEndOption[];
  onActionSelect?(taskId: string, action: TaskTimerEndActionType): void;
}

const TaskTimerEndView: FC<TaskTimerEndViewProps> = ({ getCustomOptions, onActionSelect }) => {
  const { taskTimerEndPromptHandled } = usePomelloActions();

  const { currentTaskId } = useSelector(selectPomelloState);

  const handleActionSelect = (option: TaskTimerEndActionType) => () => {
    if (currentTaskId) {
      onActionSelect?.(currentTaskId, option);
    }

    taskTimerEndPromptHandled(typeof option === 'string' ? option : option.action);
  };

  return (
    <div>
      Task timer end prompt: {currentTaskId}
      <p>
        <button onClick={handleActionSelect('continueTask')}>Continue task</button>
        <button onClick={handleActionSelect('switchTask')}>Switch task</button>
        {getCustomOptions?.().map(option => (
          <button key={option.id} onClick={handleActionSelect(option)}>
            {option.label}
          </button>
        ))}
      </p>
    </div>
  );
};

export default TaskTimerEndView;
