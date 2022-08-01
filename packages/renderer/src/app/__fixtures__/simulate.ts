import { MountAppResults, screen } from './mountApp';

const hideDialActions = async ({ userEvent }: MountAppResults) => {
  await userEvent.click(screen.getByRole('button', { name: 'Hide actions' }));
};

const selectTask = async ({ emitAppApiEvent }: MountAppResults, taskId: string = 'one') => {
  await screen.findByRole('button', { name: 'Pick a task' });

  emitAppApiEvent('onSelectChange', taskId);
};

const showDialActions = async ({ userEvent }: MountAppResults) => {
  await userEvent.click(screen.getByRole('button', { name: 'Show actions' }));
};

const startTimer = async ({ userEvent }: MountAppResults) => {
  const startTimerButton = await screen.findByRole('button', { name: 'Start timer' });

  await userEvent.click(startTimerButton);
};

const simulate = {
  hideDialActions,
  selectTask,
  showDialActions,
  startTimer,
};

export default simulate;
