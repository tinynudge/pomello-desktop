import { vi } from 'vitest';
import { renderApp, screen, waitFor } from '../__fixtures__/renderApp';

describe('App - Task void', () => {
  beforeEach(() => {
    vi.useFakeTimers({
      shouldAdvanceTime: true,
    });
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it('should go directly to the break view after voiding task if there is no note handler', async () => {
    const { simulate } = renderApp({
      settings: {
        taskTime: 3,
      },
      mockService: {
        service: {
          onNoteCreate: undefined,
        },
      },
    });

    await simulate.selectTask();
    await simulate.startTimer();
    await simulate.advanceTimer(3);
    await simulate.selectOption('voidTask');

    await waitFor(() => {
      expect(screen.getByText('Take a short break')).toBeInTheDocument();
    });
  });

  it('should show the note view when voided mid-task', async () => {
    const { simulate, userEvent } = renderApp();

    await simulate.selectTask();
    await simulate.startTimer();
    await simulate.showDialActions();
    await userEvent.click(screen.getByRole('button', { name: 'Void task' }));

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'External distraction' })).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Enter /? for help')).toBeInTheDocument();
    });
  });

  it('should show the note view when voided mid-task via hotkey', async () => {
    const { simulate } = renderApp();

    await simulate.selectTask();
    await simulate.startTimer();
    await simulate.hotkey('voidTask');

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'External distraction' })).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Enter /? for help')).toBeInTheDocument();
    });
  });

  it('should show the note view when voided after the task timer ends', async () => {
    const { simulate } = renderApp({
      settings: {
        taskTime: 3,
      },
    });

    await simulate.selectTask();
    await simulate.startTimer();
    await simulate.advanceTimer(3);
    await simulate.selectOption('voidTask');

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'External distraction' })).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Enter /? for help')).toBeInTheDocument();
    });
  });

  it('should show the note view when voided after the task timer ends via hotkey', async () => {
    const { simulate } = renderApp({
      settings: {
        taskTime: 3,
      },
    });

    await simulate.selectTask();
    await simulate.startTimer();
    await simulate.advanceTimer(3);
    await simulate.hotkey('voidTask');

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'External distraction' })).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Enter /? for help')).toBeInTheDocument();
    });
  });

  it('should show the break after entering a note', async () => {
    const onNoteCreate = vi.fn();

    const { simulate } = renderApp({
      mockService: {
        service: {
          fetchTasks: () => Promise.resolve([{ id: 'MY_TASK', label: 'My task' }]),
          onNoteCreate,
        },
      },
      settings: {
        taskTime: 3,
      },
    });

    await simulate.selectTask('MY_TASK');
    await simulate.startTimer();
    await simulate.advanceTimer(3);
    await simulate.selectOption('voidTask');
    await simulate.enterNote('foo{Enter}');

    await waitFor(() => {
      expect(onNoteCreate).toHaveBeenCalledWith('MY_TASK', {
        label: 'External distraction',
        text: 'foo',
        type: 'externalDistraction',
      });
      expect(screen.getByText('Take a short break')).toBeInTheDocument();
    });
  });

  it('should show the break after escaping the add note view', async () => {
    const { simulate } = renderApp({
      settings: {
        taskTime: 3,
      },
    });

    await simulate.selectTask();
    await simulate.startTimer();
    await simulate.advanceTimer(3);
    await simulate.selectOption('voidTask');
    await simulate.enterNote('{Escape}');

    await waitFor(() => {
      expect(screen.getByText('Take a short break')).toBeInTheDocument();
    });
  });
});
