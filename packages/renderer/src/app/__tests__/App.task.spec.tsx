import { vi } from 'vitest';
import mountApp, { screen, waitFor } from '../__fixtures__/mountApp';

describe('App - Task', () => {
  it('should show the dial', async () => {
    const { simulate } = mountApp();

    await simulate.selectTask();

    expect(screen.getByRole('button', { name: 'Start timer' })).toBeInTheDocument();
  });

  it('should show a heading if provided', async () => {
    const { simulate } = mountApp({
      service: {
        getTaskHeading: () => 'Foobar',
      },
    });

    await simulate.selectTask();

    expect(screen.getByRole('heading', { name: 'Foobar' })).toBeInTheDocument();
  });

  it('should show a custom task label if provided', async () => {
    const { simulate } = mountApp({
      service: {
        fetchTasks: () => Promise.resolve([{ id: 'custom', label: 'Task' }]),
        getTaskLabel: ({ label }) => `Custom ${label}`,
      },
    });

    await simulate.selectTask('custom');

    expect(screen.getByText('Custom Task')).toBeInTheDocument();
  });

  it('should show the correct dial actions', async () => {
    const { simulate } = mountApp();

    await simulate.selectTask();
    await simulate.startTimer();
    await simulate.showDialActions();

    expect(screen.getByRole('button', { name: 'Pause timer' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Add note' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Switch task' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Void task' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Complete task' })).toBeInTheDocument();
  });

  it('should pause the timer', async () => {
    const { simulate, userEvent } = mountApp();

    await simulate.selectTask();
    await simulate.startTimer();
    await simulate.showDialActions();
    await userEvent.click(screen.getByRole('button', { name: 'Pause timer' }));

    expect(screen.getByRole('button', { name: 'Resume timer' })).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'Resume timer' }));

    expect(screen.queryByRole('button', { name: 'Resume timer' })).not.toBeInTheDocument();
  });

  it('should pause the timer via hotkeys', async () => {
    const { simulate } = mountApp();

    await simulate.selectTask();
    await simulate.hotkey('startTimer');
    await simulate.hotkey('pauseTimer');

    waitFor(() => {
      expect(screen.getByRole('button', { name: 'Resume timer' })).toBeInTheDocument();
    });

    await simulate.hotkey('startTimer');

    waitFor(() => {
      expect(screen.queryByRole('button', { name: 'Resume timer' })).not.toBeInTheDocument();
    });
  });

  it('should switch tasks', async () => {
    const { simulate, userEvent } = mountApp();

    await simulate.selectTask();
    await simulate.startTimer();
    await simulate.showDialActions();
    await userEvent.click(screen.getByRole('button', { name: 'Switch task' }));

    expect(screen.getByRole('button', { name: 'Pick a task' })).toBeInTheDocument();
  });

  it('should switch tasks via hotkeys', async () => {
    const { simulate } = mountApp();

    await simulate.selectTask();
    await simulate.startTimer();
    await simulate.hotkey('switchTask');

    waitFor(() => {
      expect(screen.getByRole('button', { name: 'Pick a task' })).toBeInTheDocument();
    });
  });

  it('should complete tasks', async () => {
    const { simulate, userEvent } = mountApp();

    await simulate.selectTask();
    await simulate.startTimer();
    await simulate.showDialActions();
    await userEvent.click(screen.getByRole('button', { name: 'Complete task' }));

    expect(screen.getByText('task complete prompt')).toBeInTheDocument();
  });

  it('should complete tasks via hotkeys', async () => {
    const { simulate } = mountApp();

    await simulate.selectTask();
    await simulate.startTimer();
    await simulate.hotkey('completeTaskEarly');

    waitFor(() => {
      expect(screen.getByText('task complete prompt')).toBeInTheDocument();
    });
  });

  it('should void tasks', async () => {
    const { simulate, userEvent } = mountApp();

    await simulate.selectTask();
    await simulate.startTimer();
    await simulate.showDialActions();
    await userEvent.click(screen.getByRole('button', { name: 'Void task' }));

    expect(screen.getByText('task void prompt!')).toBeInTheDocument();
  });

  it('should void tasks via hotkeys', async () => {
    const { simulate } = mountApp();

    await simulate.selectTask();
    await simulate.startTimer();
    await simulate.hotkey('voidTask');

    waitFor(() => {
      expect(screen.getByText('task void prompt!')).toBeInTheDocument();
    });
  });

  it('should show an error message when unable to find the current task', async () => {
    const mockedConsole = vi.spyOn(console, 'error');
    mockedConsole.mockImplementation(() => null);

    const { simulate } = mountApp({
      service: {
        fetchTasks: () => Promise.resolve([]),
      },
    });

    await simulate.selectTask('foo');

    expect(screen.getByText('TODO: Error handler')).toBeInTheDocument();

    mockedConsole.mockRestore();
  });
});
