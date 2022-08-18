import { vi } from 'vitest';
import mountApp, { screen, waitFor } from '../__fixtures__/mountApp';

describe('App - Complete Task', () => {
  it('should go to the select task view if there is no custom options', async () => {
    const { simulate, userEvent } = mountApp({
      service: {
        getCompleteTaskOptions: undefined,
      },
    });

    await simulate.selectTask();
    await simulate.startTimer();
    await simulate.showDialActions();
    await userEvent.click(screen.getByRole('button', { name: 'Complete task' }));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Pick a task' })).toBeInTheDocument();
    });
  });

  it('should go to the select task view if getting custom options returns nothing', async () => {
    const { simulate } = mountApp({
      service: {
        getCompleteTaskOptions: () => {},
      },
    });

    await simulate.selectTask();
    await simulate.startTimer();
    await simulate.hotkey('completeTaskEarly');

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Pick a task' })).toBeInTheDocument();
    });
  });

  it('should prompt the user for an action if there are custom options', async () => {
    const { simulate } = mountApp({
      service: {
        fetchTasks: () => Promise.resolve([{ id: 'task', label: 'My task' }]),
        getCompleteTaskOptions: () => [{ id: 'option', label: 'Option' }],
      },
    });

    await simulate.selectTask('task');
    await simulate.startTimer();
    await simulate.hotkey('completeTaskEarly');

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'My task' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: "Nice! What's next?" })).toBeInTheDocument();
    });
  });

  it('should call the custom option handler when an option is selected', async () => {
    const handleTaskComplete = vi.fn();

    const { simulate } = mountApp({
      service: {
        fetchTasks: () => Promise.resolve([{ id: 'hello', label: 'World' }]),
        getCompleteTaskOptions: () => [
          { id: 'foo', label: 'Foo' },
          { id: 'bar', label: 'Bar' },
        ],
        onTaskCompletePromptHandled: handleTaskComplete,
      },
    });

    await simulate.selectTask('hello');
    await simulate.startTimer();
    await simulate.hotkey('completeTaskEarly');
    await simulate.selectOption('bar');

    await waitFor(() => {
      expect(handleTaskComplete).toHaveBeenCalledWith('hello', 'bar');
      expect(screen.getByRole('button', { name: 'Pick a task' })).toBeInTheDocument();
    });
  });
});
