import { HotkeyCommand } from '@pomello-desktop/domain';

type HotkeysByCategory = {
  headingKey: string;
  listLabelKey: string;
  hotkeyCommands: HotkeyCommand[];
};

export const hotkeysByCategory: HotkeysByCategory[] = [
  {
    listLabelKey: 'generalHotkeysLabel',
    headingKey: 'generalHotkeysHeader',
    hotkeyCommands: [
      'toggleMenu',
      'routeHome',
      'createTask',
      'routeProductivity',
      'routeSettings',
      'openInBrowser',
    ],
  },
  {
    headingKey: 'taskHotkeysHeader',
    listLabelKey: 'taskHotkeysLabel',
    hotkeyCommands: [
      'startTimer',
      'pauseTimer',
      'addNote',
      'internalDistraction',
      'externalDistraction',
      'continueTask',
      'moveTask',
      'voidTask',
      'switchTask',
      'completeTaskEarly',
    ],
  },
  {
    headingKey: 'breakHotkeysHeader',
    listLabelKey: 'breakHotkeysLabel',
    hotkeyCommands: ['skipBreak'],
  },
];
