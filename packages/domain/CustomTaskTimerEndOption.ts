import { TaskTimerEndAction } from './TaskTimerEndAction';

export interface CustomTaskTimerEndOption {
  action: TaskTimerEndAction;
  id: string;
  label: string;
}
