import { RootState } from '@/app/createStore';

const selectShowCancelTaskDialog = ({ app }: RootState) => {
  return (
    app.settings.warnBeforeTaskCancel &&
    app.pomelloState.timer?.isActive &&
    app.pomelloState.timer.type === 'TASK'
  );
};

export default selectShowCancelTaskDialog;
