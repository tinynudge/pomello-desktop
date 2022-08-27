import runtime from '@/runtime';
import { Settings, Store } from '@domain';

const getSettings = (): Store<Settings> =>
  runtime.storeManager.registerStore<Settings>({
    path: 'settings',
    defaults: {
      alwaysOnTop: true,
      snapEdges: true,
      timeExpiredNotification: 'flash',
      overtime: true,
      overtimeDelay: 300,
      checkPomelloStatus: true,
      warnBeforeTaskCancel: true,
      warnBeforeAppQuit: true,
      taskTime: 1500,
      shortBreakTime: 300,
      longBreakTime: 900,
      pomodoroSet: [
        'task',
        'shortBreak',
        'task',
        'shortBreak',
        'task',
        'shortBreak',
        'task',
        'longBreak',
      ],
      resetPomodoroSet: true,
      autoStartTasks: false,
      autoStartBreaks: false,
      titleMarker: '🍅',
      titleFormat: 'decimal',
      completedTaskPosition: 'top',
      createdTaskPosition: 'top',
      productivityChartType: 'bar',
      productivityChartDays: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
      betweenTasksGracePeriod: 8,
      longBreakTimerEndSound: 'ding',
      longBreakTimerEndVol: '1',
      longBreakTimerStartSound: 'wind-up',
      longBreakTimerStartVol: '1',
      longBreakTimerTickSound: 'egg-timer',
      longBreakTimerTickVol: '1',
      osxAllowMoveAnywhere: false,
      selectMaxRows: 10,
      shortBreakTimerEndSound: 'ding',
      shortBreakTimerEndVol: '1',
      shortBreakTimerStartSound: 'wind-up',
      shortBreakTimerStartVol: '1',
      shortBreakTimerTickSound: 'egg-timer',
      shortBreakTimerTickVol: '1',
      showAddNoteButton: true,
      showMenuButton: true,
      showPauseButton: true,
      showSwitchTaskButton: true,
      showTaskFinishedButton: true,
      showVoidTaskButton: true,
      taskTimerEndSound: 'ding',
      taskTimerEndVol: '1',
      taskTimerStartSound: 'wind-up',
      taskTimerStartVol: '1',
      taskTimerTickSound: 'egg-timer',
      taskTimerTickVol: '1',
      sounds: {},
    },
    schema: {
      type: 'object',
      properties: {
        alwaysOnTop: {
          type: 'boolean',
        },
        snapEdges: {
          type: 'boolean',
        },
        timeExpiredNotification: {
          type: 'string',
        },
        overtime: {
          type: 'boolean',
        },
        overtimeDelay: {
          type: 'integer',
        },
        checkPomelloStatus: {
          type: 'boolean',
        },
        warnBeforeTaskCancel: {
          type: 'boolean',
        },
        warnBeforeAppQuit: {
          type: 'boolean',
        },
        taskTime: {
          type: 'integer',
        },
        shortBreakTime: {
          type: 'integer',
        },
        longBreakTime: {
          type: 'integer',
        },
        pomodoroSet: {
          oneOf: [
            { type: 'integer' },
            {
              type: 'array',
              items: {
                type: 'string',
              },
            },
          ],
        },
        resetPomodoroSet: {
          type: 'boolean',
        },
        autoStartTasks: {
          type: 'boolean',
        },
        autoStartBreaks: {
          type: 'boolean',
        },
        titleMarker: {
          type: 'string',
        },
        titleFormat: {
          type: 'string',
        },
        completedTaskPosition: {
          type: 'string',
        },
        createdTaskPosition: {
          type: 'string',
        },
        productivityChartType: {
          type: 'string',
        },
        productivityChartDays: {
          type: 'array',
          maxItems: 7,
          items: {
            type: 'string',
          },
        },
        betweenTasksGracePeriod: {
          type: 'integer',
        },
        longBreakTimerEndSound: {
          type: 'string',
        },
        longBreakTimerEndVol: {
          type: ['number', 'string'],
        },
        longBreakTimerStartSound: {
          type: 'string',
        },
        longBreakTimerStartVol: {
          type: ['number', 'string'],
        },
        longBreakTimerTickSound: {
          type: 'string',
        },
        longBreakTimerTickVol: {
          type: ['number', 'string'],
        },
        osxAllowMoveAnywhere: {
          type: 'boolean',
        },
        selectMaxRows: {
          type: 'integer',
        },
        shortBreakTimerEndSound: {
          type: 'string',
        },
        shortBreakTimerEndVol: {
          type: ['number', 'string'],
        },
        shortBreakTimerStartSound: {
          type: 'string',
        },
        shortBreakTimerStartVol: {
          type: ['number', 'string'],
        },
        shortBreakTimerTickSound: {
          type: 'string',
        },
        shortBreakTimerTickVol: {
          type: ['number', 'string'],
        },
        showAddNoteButton: {
          type: 'boolean',
        },
        showMenuButton: {
          type: 'boolean',
        },
        showPauseButton: {
          type: 'boolean',
        },
        showSwitchTaskButton: {
          type: 'boolean',
        },
        showTaskFinishedButton: {
          type: 'boolean',
        },
        showVoidTaskButton: {
          type: 'boolean',
        },
        taskTimerEndSound: {
          type: 'string',
        },
        taskTimerEndVol: {
          type: ['number', 'string'],
        },
        taskTimerStartSound: {
          type: 'string',
        },
        taskTimerStartVol: {
          type: ['number', 'string'],
        },
        taskTimerTickSound: {
          type: 'string',
        },
        taskTimerTickVol: {
          type: ['number', 'string'],
        },
        sounds: {
          type: 'object',
          additionalProperties: {
            type: 'object',
            properties: {
              name: {
                type: 'string',
              },
              path: {
                type: 'string',
              },
            },
            required: ['name', 'path'],
          },
          required: [],
        },
        timestamp: {
          type: 'integer',
          nullable: true,
        },
      },
      required: [
        'alwaysOnTop',
        'snapEdges',
        'timeExpiredNotification',
        'overtime',
        'overtimeDelay',
        'checkPomelloStatus',
        'warnBeforeTaskCancel',
        'warnBeforeAppQuit',
        'taskTime',
        'shortBreakTime',
        'longBreakTime',
        'pomodoroSet',
        'resetPomodoroSet',
        'autoStartTasks',
        'autoStartBreaks',
        'titleMarker',
        'titleFormat',
        'completedTaskPosition',
        'createdTaskPosition',
        'productivityChartType',
        'productivityChartDays',
        'betweenTasksGracePeriod',
        'longBreakTimerEndSound',
        'longBreakTimerEndVol',
        'longBreakTimerStartSound',
        'longBreakTimerStartVol',
        'longBreakTimerTickSound',
        'longBreakTimerTickVol',
        'osxAllowMoveAnywhere',
        'selectMaxRows',
        'shortBreakTimerEndSound',
        'shortBreakTimerEndVol',
        'shortBreakTimerStartSound',
        'shortBreakTimerStartVol',
        'shortBreakTimerTickSound',
        'shortBreakTimerTickVol',
        'showAddNoteButton',
        'showMenuButton',
        'showPauseButton',
        'showSwitchTaskButton',
        'showTaskFinishedButton',
        'showVoidTaskButton',
        'taskTimerEndSound',
        'taskTimerEndVol',
        'taskTimerStartSound',
        'taskTimerStartVol',
        'taskTimerTickSound',
        'taskTimerTickVol',
        'sounds',
      ],
    },
  });

export default getSettings;
