import { selectPomelloState } from '@/app/appSlice';
import usePomelloActions from '@/app/hooks/usePomelloActions';
import useService from '@/shared/hooks/useService';
import { TaskTimerEndActionType } from '@domain';
import { FC } from 'react';
import { useSelector } from 'react-redux';

const TaskTimerEndView: FC = () => {
  const { getTaskTimerEndOptions, onTaskTimerEndPromptHandled } = useService();
  const { taskTimerEndPromptHandled } = usePomelloActions();

  const { currentTaskId } = useSelector(selectPomelloState);

  const handleActionSelect = (option: TaskTimerEndActionType) => () => {
    if (currentTaskId) {
      onTaskTimerEndPromptHandled?.(currentTaskId, option);
    }

    taskTimerEndPromptHandled(typeof option === 'string' ? option : option.action);
  };

  return (
    <div>
      Task timer end prompt: {currentTaskId}
      <p>
        <button onClick={handleActionSelect('continueTask')}>Continue task</button>
        <button onClick={handleActionSelect('switchTask')}>Switch task</button>
        {getTaskTimerEndOptions?.().map(option => (
          <button key={option.id} onClick={handleActionSelect(option)}>
            {option.label}
          </button>
        ))}
      </p>
    </div>
  );
};

export default TaskTimerEndView;
