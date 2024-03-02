import mountApp from '../__fixtures__/mountApp';

describe('App - Track Stats', () => {
  it('should track a task timer end event when the timer ends', async () => {
    const { simulate, pomelloApi } = mountApp({
      mockService: {
        service: {
          getTrackingStatus: () => true,
          fetchTasks: () =>
            Promise.resolve([
              {
                id: 'MY_TASK_ID',
                label: 'My very first task',
              },
            ]),
        },
      },
      settings: {
        taskTime: 5,
      },
    });

    await simulate.selectTask('MY_TASK_ID');
    await simulate.startTimer();
    await simulate.advanceTimer(5);

    expect(pomelloApi.logEvent).toHaveBeenLastCalledWith({
      allotted_time: 5,
      duration: 5,
      service_id: 'MY_TASK_ID',
      start_time: expect.any(Number),
      type: 'task',
    });
  });

  it('should track a task timer end event when the task is completed early', async () => {
    const { simulate, pomelloApi } = mountApp({
      mockService: {
        service: {
          getTrackingStatus: () => true,
          fetchTasks: () =>
            Promise.resolve([
              {
                id: 'MY_TASK_ID',
                label: 'My very first task',
              },
              {
                id: 'MY_TASK_ID_2',
                label: 'My very second task',
              },
            ]),
        },
      },
      settings: {
        taskTime: 5,
      },
    });

    await simulate.selectTask('MY_TASK_ID');
    await simulate.startTimer();
    await simulate.advanceTimer(2);
    await simulate.hotkey('completeTaskEarly');

    expect(pomelloApi.logEvent).toHaveBeenLastCalledWith({
      allotted_time: 5,
      duration: 2,
      service_id: 'MY_TASK_ID',
      start_time: expect.any(Number),
      type: 'task',
    });

    await simulate.selectTask('MY_TASK_ID_2');
    await simulate.advanceTimer(5);

    expect(pomelloApi.logEvent).toHaveBeenLastCalledWith({
      allotted_time: 5,
      duration: 3,
      service_id: 'MY_TASK_ID_2',
      start_time: expect.any(Number),
      type: 'task',
    });
  });

  it('should track a short break timer end event when the timer ends', async () => {
    const { simulate, pomelloApi } = mountApp({
      mockService: {
        service: {
          getTrackingStatus: () => true,
          fetchTasks: () =>
            Promise.resolve([
              {
                id: 'MY_TASK_ID',
                label: 'My very first task',
              },
            ]),
        },
      },
      settings: {
        taskTime: 1,
        shortBreakTime: 5,
      },
    });

    await simulate.selectTask('MY_TASK_ID');
    await simulate.startTimer();
    await simulate.advanceTimer(1);
    await simulate.selectOption('continueTask');
    await simulate.advanceTimer(5);

    expect(pomelloApi.logEvent).toHaveBeenLastCalledWith({
      allotted_time: 5,
      duration: 5,
      service_id: 'MY_TASK_ID',
      start_time: expect.any(Number),
      meta: {
        type: 'short',
      },
      type: 'break',
    });
  });

  it('should track a short break timer end event when the timer is skipped', async () => {
    const { simulate, pomelloApi } = mountApp({
      mockService: {
        service: {
          getTrackingStatus: () => true,
          fetchTasks: () =>
            Promise.resolve([
              {
                id: 'MY_TASK_ID',
                label: 'My very first task',
              },
            ]),
        },
      },
      settings: {
        taskTime: 1,
        shortBreakTime: 5,
      },
    });

    await simulate.selectTask('MY_TASK_ID');
    await simulate.startTimer();
    await simulate.advanceTimer(1);
    await simulate.selectOption('continueTask');
    await simulate.advanceTimer(3);
    await simulate.hotkey('skipBreak');

    expect(pomelloApi.logEvent).toHaveBeenLastCalledWith({
      allotted_time: 5,
      duration: 3,
      service_id: 'MY_TASK_ID',
      start_time: expect.any(Number),
      meta: {
        type: 'short',
      },
      type: 'break',
    });
  });

  it('should track a long break timer end event when the timer ends', async () => {
    const { pomelloApi, simulate } = mountApp({
      mockService: {
        service: {
          getTrackingStatus: () => true,
          fetchTasks: () =>
            Promise.resolve([
              {
                id: 'MY_TASK_ID',
                label: 'My very first task',
              },
            ]),
        },
      },
      settings: {
        longBreakTime: 10,
        pomodoroSet: ['task', 'longBreak'],
        taskTime: 1,
      },
    });

    await simulate.selectTask('MY_TASK_ID');
    await simulate.startTimer();
    await simulate.advanceTimer(1);
    await simulate.selectOption('continueTask');
    await simulate.advanceTimer(10);

    expect(pomelloApi.logEvent).toHaveBeenLastCalledWith({
      allotted_time: 10,
      duration: 10,
      service_id: 'MY_TASK_ID',
      start_time: expect.any(Number),
      meta: {
        type: 'long',
      },
      type: 'break',
    });
  });

  it('should track a long break timer end event when the timer is skipped', async () => {
    const { pomelloApi, simulate } = mountApp({
      mockService: {
        service: {
          getTrackingStatus: () => true,
          fetchTasks: () =>
            Promise.resolve([
              {
                id: 'MY_TASK_ID',
                label: 'My very first task',
              },
            ]),
        },
      },
      settings: {
        longBreakTime: 10,
        pomodoroSet: ['task', 'longBreak'],
        taskTime: 1,
      },
    });

    await simulate.selectTask('MY_TASK_ID');
    await simulate.startTimer();
    await simulate.advanceTimer(1);
    await simulate.selectOption('continueTask');
    await simulate.advanceTimer(5);
    await simulate.hotkey('skipBreak');

    expect(pomelloApi.logEvent).toHaveBeenLastCalledWith({
      allotted_time: 10,
      duration: 5,
      service_id: 'MY_TASK_ID',
      start_time: expect.any(Number),
      meta: {
        type: 'long',
      },
      type: 'break',
    });
  });
});
