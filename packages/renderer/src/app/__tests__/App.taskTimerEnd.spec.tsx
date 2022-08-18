import { TaskTimerEndPromptHandledAction } from '@tinynudge/pomello-service';
import { vi } from 'vitest';
import mountApp, { act, screen } from '../__fixtures__/mountApp';

describe('App - Task Timer End', () => {
  beforeEach(() => {
    vi.useFakeTimers({
      shouldAdvanceTime: true,
    });
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it('should show the view when the task timer ends', async () => {
    const { simulate } = mountApp({
      settings: {
        taskTime: 3,
      },
      service: {
        fetchTasks: () => Promise.resolve([{ id: 'foo', label: 'Foo' }]),
      },
    });

    await simulate.selectTask('foo');
    await simulate.startTimer();

    act(() => {
      vi.advanceTimersByTime(3000);
    });

    expect(screen.getByRole('heading', { name: 'Foo' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: "Time's up! How'd you do?" })).toBeInTheDocument();
  });

  it('should show the correct options', async () => {
    const { appApi, simulate } = mountApp({
      settings: {
        taskTime: 3,
      },
    });

    await simulate.selectTask();
    await simulate.startTimer();

    act(() => {
      vi.advanceTimersByTime(3000);
    });

    expect(appApi.setSelectItems).toHaveBeenLastCalledWith(
      expect.objectContaining({
        items: [
          { id: 'continueTask', label: 'Continue after break' },
          { id: 'switchTask', label: 'Switch tasks after break' },
          { id: 'voidTask', label: 'Void this pomodoro' },
          { id: 'addNote', label: 'Add a note first' },
        ],
      })
    );
  });

  it('should show custom options', async () => {
    const { appApi, simulate } = mountApp({
      settings: {
        taskTime: 3,
      },
      service: {
        getTaskTimerEndOptions: () => [{ id: 'foo', label: 'Foobar' }],
      },
    });

    await simulate.selectTask();
    await simulate.startTimer();

    act(() => {
      vi.advanceTimersByTime(3000);
    });

    expect(appApi.setSelectItems).toHaveBeenLastCalledWith(
      expect.objectContaining({
        items: expect.arrayContaining([{ id: 'foo', label: 'Foobar' }]),
      })
    );
  });

  it('should handle the continue task option', async () => {
    const { simulate } = mountApp({
      settings: {
        taskTime: 3,
      },
      service: {
        fetchTasks: () => Promise.resolve([{ id: 'foo', label: 'Foo' }]),
      },
    });

    await simulate.selectTask('foo');
    await simulate.startTimer();

    act(() => {
      vi.advanceTimersByTime(3000);
    });

    await simulate.selectOption('continueTask');

    expect(screen.getByRole('heading', { name: 'Next: Foo' })).toBeInTheDocument();
    expect(screen.getByText('Take a short break')).toBeInTheDocument();
  });

  it('should handle the continue task hotkey', async () => {
    const { simulate } = mountApp({
      settings: {
        taskTime: 3,
      },
      service: {
        fetchTasks: () => Promise.resolve([{ id: 'foo', label: 'Foo' }]),
      },
    });

    await simulate.selectTask('foo');
    await simulate.startTimer();

    act(() => {
      vi.advanceTimersByTime(3000);
    });

    await simulate.hotkey('continueTask');

    expect(screen.getByRole('heading', { name: 'Next: Foo' })).toBeInTheDocument();
    expect(screen.getByText('Take a short break')).toBeInTheDocument();
  });

  it('should handle the switch task option', async () => {
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

    await simulate.selectOption('switchTask');

    expect(screen.getByRole('heading', { name: 'Next: New task' })).toBeInTheDocument();
    expect(screen.getByText('Take a short break')).toBeInTheDocument();
  });

  it('should handle the add note option', async () => {
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

    await simulate.selectOption('addNote');

    expect(screen.getByRole('heading', { name: 'Add note' })).toBeInTheDocument();
  });

  it('should handle the add note hotkey', async () => {
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

    await simulate.hotkey('addNote');

    expect(screen.getByRole('heading', { name: 'Add note' })).toBeInTheDocument();
  });

  it('should handle the void task option', async () => {
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

    expect(screen.getByRole('heading', { name: 'External distraction' })).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter /? for help')).toBeInTheDocument();
  });

  it('should handle the void task hotkey', async () => {
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

    expect(screen.getByRole('heading', { name: 'External distraction' })).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter /? for help')).toBeInTheDocument();
  });

  it('should handle a custom option without an action', async () => {
    const mockTaskTimerEndPromptHandler = vi.fn();

    const { simulate } = mountApp({
      settings: {
        taskTime: 3,
      },
      service: {
        getTaskTimerEndOptions: () => [{ id: 'foo', label: 'Foo' }],
        fetchTasks: () => Promise.resolve([{ id: 'hello', label: 'World' }]),
        onTaskTimerEndPromptHandled: mockTaskTimerEndPromptHandler,
      },
    });

    await simulate.selectTask('hello');
    await simulate.startTimer();

    act(() => {
      vi.advanceTimersByTime(3000);
    });

    await simulate.selectOption('foo');

    expect(mockTaskTimerEndPromptHandler).toHaveBeenCalledWith(
      { id: 'hello', label: 'World' },
      'foo'
    );
  });

  it('should handle a custom continue task option', async () => {
    const mockTaskTimerEndPromptHandler = vi.fn(
      () => 'continueTask' as TaskTimerEndPromptHandledAction
    );

    const { simulate } = mountApp({
      settings: {
        taskTime: 3,
      },
      service: {
        fetchTasks: () => Promise.resolve([{ id: 'hello', label: 'World' }]),
        getTaskTimerEndOptions: () => [{ id: 'foo', label: 'Foo' }],
        onTaskTimerEndPromptHandled: mockTaskTimerEndPromptHandler,
      },
    });

    await simulate.selectTask('hello');
    await simulate.startTimer();

    act(() => {
      vi.advanceTimersByTime(3000);
    });

    await simulate.selectOption('foo');

    expect(mockTaskTimerEndPromptHandler).toHaveBeenCalled();
    expect(screen.getByRole('heading', { name: 'Next: World' })).toBeInTheDocument();
    expect(screen.getByText('Take a short break')).toBeInTheDocument();
  });

  it('should handle a custom switch task option', async () => {
    const mockTaskTimerEndPromptHandler = vi.fn(
      () => 'switchTask' as TaskTimerEndPromptHandledAction
    );

    const { simulate } = mountApp({
      settings: {
        taskTime: 3,
      },
      service: {
        getTaskTimerEndOptions: () => [{ id: 'foo', label: 'Foo' }],
        onTaskTimerEndPromptHandled: mockTaskTimerEndPromptHandler,
      },
    });

    await simulate.selectTask();
    await simulate.startTimer();

    act(() => {
      vi.advanceTimersByTime(3000);
    });

    await simulate.selectOption('foo');

    expect(mockTaskTimerEndPromptHandler).toHaveBeenCalled();
    expect(screen.getByRole('heading', { name: 'Next: New task' })).toBeInTheDocument();
    expect(screen.getByText('Take a short break')).toBeInTheDocument();
  });

  it('should handle a custom void task option', async () => {
    const mockTaskTimerEndPromptHandler = vi.fn(
      () => 'voidTask' as TaskTimerEndPromptHandledAction
    );

    const { simulate } = mountApp({
      settings: {
        taskTime: 3,
      },
      service: {
        getTaskTimerEndOptions: () => [{ id: 'foo', label: 'Foo' }],
        onTaskTimerEndPromptHandled: mockTaskTimerEndPromptHandler,
      },
    });

    await simulate.selectTask();
    await simulate.startTimer();

    act(() => {
      vi.advanceTimersByTime(3000);
    });

    await simulate.selectOption('foo');

    expect(mockTaskTimerEndPromptHandler).toHaveBeenCalled();
    expect(screen.getByRole('heading', { name: 'External distraction' })).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter /? for help')).toBeInTheDocument();
  });
});