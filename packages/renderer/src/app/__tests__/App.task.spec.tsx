import { vi } from 'vitest';
import mountApp, { screen, waitFor } from '../__fixtures__/mountApp';

describe('App - Task', () => {
  it('should be able to select nested tasks', async () => {
    const { simulate } = mountApp({
      mockService: {
        service: {
          fetchTasks: () =>
            Promise.resolve([
              {
                id: 'group',
                items: [
                  { id: 'group-one', label: 'Group One' },
                  {
                    id: 'nested-group',
                    items: [{ id: 'nested-group-one', label: 'Nested Group One' }],
                    label: 'My nested group',
                    type: 'group',
                  },
                ],
                label: 'My group',
                type: 'group',
              },
            ]),
        },
      },
    });

    await simulate.selectTask('nested-group-one');

    expect(screen.getByText('Nested Group One')).toBeInTheDocument();
  });

  it('should show the dial', async () => {
    const { simulate } = mountApp();

    await simulate.selectTask();

    expect(screen.getByRole('button', { name: 'Start timer' })).toBeInTheDocument();
  });

  it('should show a heading if provided', async () => {
    const { simulate } = mountApp({
      mockService: {
        service: {
          getTaskHeading: () => 'Foobar',
        },
      },
    });

    await simulate.selectTask();

    expect(screen.getByRole('heading', { name: 'Foobar' })).toBeInTheDocument();
  });

  it('should show a custom task label if provided', async () => {
    const { simulate } = mountApp({
      mockService: {
        service: {
          fetchTasks: () => Promise.resolve([{ id: 'custom', label: 'Task' }]),
          getTaskLabel: ({ label }) => `Custom ${label}`,
        },
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

    const pauseButton = screen.getByRole('button', { name: 'Pause timer' });
    const addNoteButton = screen.getByRole('button', { name: 'Add note' });
    const switchTaskButton = screen.getByRole('button', { name: 'Switch task' });
    const voidTaskButton = screen.getByRole('button', { name: 'Void task' });
    const completeTaskButton = screen.getByRole('button', { name: 'Complete task' });

    expect(pauseButton).toBeInTheDocument();
    expect(pauseButton).toHaveAttribute('title', 'Pause timer (Pause timer label)');

    expect(addNoteButton).toBeInTheDocument();
    expect(addNoteButton).toHaveAttribute('title', 'Add note (Add note label)');

    expect(switchTaskButton).toBeInTheDocument();
    expect(switchTaskButton).toHaveAttribute('title', 'Switch task (Switch task label)');

    expect(voidTaskButton).toBeInTheDocument();
    expect(voidTaskButton).toHaveAttribute('title', 'Void task (Void task label)');

    expect(completeTaskButton).toBeInTheDocument();
    expect(completeTaskButton).toHaveAttribute(
      'title',
      'Complete task (Complete task early label)'
    );
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

    expect(screen.queryByRole('button', { name: 'Resume timer' })).not.toBeInTheDocument();
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

    expect(screen.getByRole('button', { name: 'Pick a task' })).toBeInTheDocument();
  });

  it('should complete tasks', async () => {
    const { simulate, userEvent } = mountApp({
      mockService: {
        service: {
          getCompleteTaskOptions: () => [{ id: 'option', label: 'Option' }],
        },
      },
    });

    await simulate.selectTask();
    await simulate.startTimer();
    await simulate.showDialActions();
    await userEvent.click(screen.getByRole('button', { name: 'Complete task' }));

    expect(screen.getByRole('button', { name: "Nice! What's next?" })).toBeInTheDocument();
  });

  it('should complete tasks via hotkeys', async () => {
    const { simulate } = mountApp({
      mockService: {
        service: {
          getCompleteTaskOptions: () => [{ id: 'option', label: 'Option' }],
        },
      },
    });

    await simulate.selectTask();
    await simulate.startTimer();
    await simulate.hotkey('completeTaskEarly');

    expect(screen.getByRole('button', { name: "Nice! What's next?" })).toBeInTheDocument();
  });

  it('should void tasks', async () => {
    const { simulate, userEvent } = mountApp();

    await simulate.selectTask();
    await simulate.startTimer();
    await simulate.showDialActions();
    await userEvent.click(screen.getByRole('button', { name: 'Void task' }));

    expect(screen.getByRole('heading', { name: 'External distraction' })).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter /? for help')).toBeInTheDocument();
  });

  it('should void tasks via hotkeys', async () => {
    const { simulate } = mountApp();

    await simulate.selectTask();
    await simulate.startTimer();
    await simulate.hotkey('voidTask');

    expect(screen.getByRole('heading', { name: 'External distraction' })).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter /? for help')).toBeInTheDocument();
  });

  it('should show an error message when unable to find the current task', async () => {
    const mockedConsole = vi.spyOn(console, 'error');
    mockedConsole.mockImplementation(() => null);

    const { simulate } = mountApp({
      mockService: {
        service: {
          fetchTasks: () => Promise.resolve([]),
        },
      },
    });

    await simulate.selectTask('foo');

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();

    mockedConsole.mockRestore();
  });
});
