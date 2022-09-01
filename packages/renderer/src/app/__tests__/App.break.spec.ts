import { vi } from 'vitest';
import mountApp, { act, screen } from '../__fixtures__/mountApp';

describe('App - Break', () => {
  beforeEach(() => {
    vi.useFakeTimers({
      shouldAdvanceTime: true,
    });
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it('should show a short break', async () => {
    const { simulate } = mountApp({
      settings: {
        taskTime: 3,
      },
      mockService: {
        service: {
          fetchTasks: () => Promise.resolve([{ id: 'foo', label: 'Foo' }]),
        },
      },
    });

    await simulate.selectTask('foo');
    await simulate.startTimer();
    await simulate.advanceTimer();
    await simulate.selectOption('continueTask');

    expect(screen.getByRole('heading', { name: 'Next: Foo' })).toBeInTheDocument();
    expect(screen.getByText('Take a short break')).toBeInTheDocument();
  });

  it('should show a long break', async () => {
    const { simulate } = mountApp({
      settings: {
        taskTime: 3,
        set: ['task', 'longBreak'],
      },
    });

    await simulate.selectTask();
    await simulate.startTimer();
    await simulate.advanceTimer();
    await simulate.selectOption('switchTask');

    expect(screen.getByRole('heading', { name: 'Next: New task' })).toBeInTheDocument();
    expect(screen.getByText('Take a long break')).toBeInTheDocument();
  });

  it('should show the correct dial actions', async () => {
    const { simulate } = mountApp({
      settings: {
        taskTime: 3,
      },
      mockService: {
        service: {
          fetchTasks: () => Promise.resolve([{ id: 'foo', label: 'Foo' }]),
        },
      },
    });

    await simulate.selectTask('foo');
    await simulate.startTimer();
    await simulate.advanceTimer();
    await simulate.selectOption('continueTask');
    await simulate.showDialActions();

    expect(screen.getByRole('button', { name: 'Skip break' })).toBeInTheDocument();
  });

  it('should be able to skip the break timer', async () => {
    const { simulate, userEvent } = mountApp({
      settings: {
        taskTime: 3,
      },
    });

    await simulate.selectTask();
    await simulate.startTimer();
    await simulate.advanceTimer();
    await simulate.selectOption('switchTask');
    await simulate.showDialActions();
    await userEvent.click(screen.getByRole('button', { name: 'Skip break' }));

    expect(screen.getByRole('button', { name: 'Pick a task' })).toBeInTheDocument();
  });

  it('should be able to skip the break timer via hotkey', async () => {
    const { simulate } = mountApp({
      settings: {
        taskTime: 3,
      },
      mockService: {
        service: {
          fetchTasks: () => Promise.resolve([{ id: 'foo', label: 'Foo' }]),
        },
      },
    });

    await simulate.selectTask('foo');
    await simulate.startTimer();

    act(() => {
      vi.advanceTimersByTime(3000);
    });

    await simulate.selectOption('continueTask');
    await simulate.hotkey('skipBreak');

    expect(screen.getByText('Foo')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Start timer' })).toBeInTheDocument();
  });

  it('should show the correct title for the dial actions', async () => {
    const { simulate } = mountApp({
      settings: {
        taskTime: 3,
      },
    });

    await simulate.selectTask();
    await simulate.startTimer();
    await simulate.advanceTimer();
    await simulate.selectOption('continueTask');
    await simulate.showDialActions();

    expect(screen.getByRole('button', { name: 'Skip break' })).toHaveAttribute(
      'title',
      'Skip break (Skip break label)'
    );
  });
});
