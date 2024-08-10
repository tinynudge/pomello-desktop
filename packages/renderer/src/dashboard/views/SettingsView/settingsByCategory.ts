import { Settings } from '@pomello-desktop/domain';

export type Setting = PomodoroSetSetting | SelectSetting | TimeSetting | ToggleSetting;

export type PomodoroSetSetting = {
  default: NonNullable<Settings['pomodoroSet']>;
  id: 'pomodoroSet';
  type: 'pomodoroSet';
};

export type SelectSetting<TSetting = keyof Settings> = TSetting extends keyof Settings
  ? {
      default: NonNullable<Settings[TSetting]>;
      id: TSetting;
      options: string[];
      type: 'select';
    }
  : never;

export type TimeSetting<TSetting = keyof Settings> = TSetting extends keyof Settings
  ? {
      default: NonNullable<Settings[TSetting]>;
      id: TSetting;
      max: number;
      min: number;
      type: 'time';
    }
  : never;

export type ToggleSetting<TSetting = keyof Settings> = TSetting extends keyof Settings
  ? {
      default: NonNullable<Settings[TSetting]>;
      id: TSetting;
      type: 'toggle';
    }
  : never;

type SettingsByCategory = {
  headingKey: string;
  listLabelKey: string;
  settings: Setting[];
};

export const settingsByCategory: SettingsByCategory[] = [
  {
    listLabelKey: 'generalSettingsLabel',
    headingKey: 'generalSettingsHeader',
    settings: [
      {
        default: true,
        id: 'alwaysOnTop',
        type: 'toggle',
      },
      {
        default: false,
        id: 'snapEdges',
        type: 'toggle',
      },
      {
        default: 'focus',
        id: 'timeExpiredNotification',
        options: ['flash', 'focus'],
        type: 'select',
      },
      {
        default: true,
        id: 'overtime',
        type: 'toggle',
      },
      {
        default: 60,
        id: 'overtimeDelay',
        max: 15,
        min: 1,
        type: 'time',
      },
      {
        default: true,
        id: 'checkPomelloStatus',
        type: 'toggle',
      },
      {
        default: true,
        id: 'warnBeforeTaskCancel',
        type: 'toggle',
      },
      {
        default: true,
        id: 'warnBeforeAppQuit',
        type: 'toggle',
      },
    ],
  },
  {
    headingKey: 'pomodoroSettingsHeader',
    listLabelKey: 'pomodoroSettingsLabel',
    settings: [
      {
        default: 1500,
        id: 'taskTime',
        max: 60,
        min: 1,
        type: 'time',
      },
      {
        default: 300,
        id: 'shortBreakTime',
        max: 30,
        min: 1,
        type: 'time',
      },
      {
        default: 900,
        id: 'longBreakTime',
        max: 60,
        min: 1,
        type: 'time',
      },
      {
        default: 4,
        id: 'pomodoroSet',
        type: 'pomodoroSet',
      },
      {
        default: true,
        id: 'resetPomodoroSet',
        type: 'toggle',
      },
      {
        default: false,
        id: 'autoStartTasks',
        type: 'toggle',
      },
      {
        default: false,
        id: 'autoStartBreaks',
        type: 'toggle',
      },
    ],
  },
];
