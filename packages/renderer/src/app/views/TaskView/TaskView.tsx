import { selectPomelloState } from '@/app/appSlice';
import usePomelloActions from '@/app/hooks/usePomelloActions';
import { FC } from 'react';
import { useSelector } from 'react-redux';

const TaskView: FC = () => {
  const { startTimer, pauseTimer, switchTask, completeTask } = usePomelloActions();

  const { currentTaskId, timer } = useSelector(selectPomelloState);

  return (
    <div>
      Task: {currentTaskId}
      <p style={{ display: 'flex', gap: 8 }}>
        {timer && !(timer.isActive || timer.isPaused) && (
          <button onClick={startTimer}>Start</button>
        )}
        {timer?.isPaused && <button onClick={startTimer}>Resume</button>}
        {timer?.isActive && <button onClick={pauseTimer}>Pause</button>}
        {(timer?.isActive || timer?.isPaused) && (
          <>
            <button onClick={completeTask}>Complete task</button>
            <button onClick={switchTask}>Switch task</button>
          </>
        )}
      </p>
      {timer && <pre>{JSON.stringify(timer, null, 2)}</pre>}
    </div>
  );
};

export default TaskView;
