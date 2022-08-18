import { vi } from 'vitest';
import mountApp, { act, screen, waitFor } from '../__fixtures__/mountApp';

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
    const { simulate } = mountApp({
      settings: {
        taskTime: 3,
      },
      service: {
        handleNoteAdd: undefined,
      },
    });

    await simulate.selectTask();
    await simulate.startTimer();

    act(() => {
      vi.advanceTimersByTime(3000);
    });

    await simulate.selectOption('voidTask');

    await waitFor(() => {
      expect(screen.getByText('Take a short break')).toBeInTheDocument();
    });
  });

  it('should show the note view when voided mid-task', async () => {
    const { simulate, userEvent } = mountApp();

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
    const { simulate } = mountApp();

    await simulate.selectTask();
    await simulate.startTimer();
    await simulate.hotkey('voidTask');

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'External distraction' })).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Enter /? for help')).toBeInTheDocument();
    });
  });

  it('should show the note view when voided after the task timer ends', async () => {
    const { simulate } = mountApp({
      settings: {
        taskTime: 3,
      },
    });

    await simulate.selectTask();
    await simulate.startTimer();

    act(() => {
      vi.advanceTimersByTime(3000);
    });

    await simulate.selectOption('voidTask');

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'External distraction' })).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Enter /? for help')).toBeInTheDocument();
    });
  });

  it('should show the note view when voided after the task timer ends via hotkey', async () => {
    const { simulate } = mountApp({
      settings: {
        taskTime: 3,
      },
    });

    await simulate.selectTask();
    await simulate.startTimer();

    act(() => {
      vi.advanceTimersByTime(3000);
    });

    await simulate.hotkey('voidTask');

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'External distraction' })).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Enter /? for help')).toBeInTheDocument();
    });
  });

  it('should show the break after entering a note', async () => {
    const handleNoteAdd = vi.fn();

    const { simulate } = mountApp({
      service: {
        handleNoteAdd,
      },
      settings: {
        taskTime: 3,
      },
    });

    await simulate.selectTask();
    await simulate.startTimer();

    act(() => {
      vi.advanceTimersByTime(3000);
    });

    await simulate.selectOption('voidTask');
    await simulate.enterNote('foo{Enter}');

    await waitFor(() => {
      expect(handleNoteAdd).toHaveBeenCalledWith('externalDistraction', 'foo');
      expect(screen.getByText('Take a short break')).toBeInTheDocument();
    });
  });

  it('should show the break after escaping the add note view', async () => {
    const { simulate } = mountApp({
      settings: {
        taskTime: 3,
      },
    });

    await simulate.selectTask();
    await simulate.startTimer();

    act(() => {
      vi.advanceTimersByTime(3000);
    });

    await simulate.selectOption('voidTask');
    await simulate.enterNote('{Escape}');

    await waitFor(() => {
      expect(screen.getByText('Take a short break')).toBeInTheDocument();
    });
  });
});