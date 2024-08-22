import { LabeledHotkeys } from '@pomello-desktop/domain';

export const mockHotkeys: LabeledHotkeys = {
  addNote: {
    binding: 'command+shift+a',
    keys: [['command', 'shift', 'a']],
    label: 'Add note label',
  },
  completeTaskEarly: {
    binding: 'command+shift+b',
    keys: [['command', 'shift', 'b']],
    label: 'Complete task early label',
  },
  continueTask: {
    binding: 'command+shift+c',
    keys: [['command', 'shift', 'c']],
    label: 'Continue task label',
  },
  createTask: {
    binding: 'command+shift+d',
    keys: [['command', 'shift', 'd']],
    label: 'Create task label',
  },
  externalDistraction: {
    binding: 'command+shift+e',
    keys: [['command', 'shift', 'e']],
    label: 'External distraction label',
  },
  internalDistraction: {
    binding: 'command+shift+f',
    keys: [['command', 'shift', 'f']],
    label: 'Internal distraction label',
  },
  moveTask: {
    binding: 'command+shift+g',
    keys: [['command', 'shift', 'g']],
    label: 'Move task label',
  },
  openInBrowser: {
    binding: 'command+shift+h',
    keys: [['command', 'shift', 'h']],
    label: 'Open in browser label',
  },
  pauseTimer: {
    binding: 'command+shift+i',
    keys: [['command', 'shift', 'i']],
    label: 'Pause timer label',
  },
  routeHome: {
    binding: 'command+shift+j',
    keys: [['command', 'shift', 'j']],
    label: 'Route home label',
  },
  routeProductivity: {
    binding: 'command+shift+k',
    keys: [['command', 'shift', 'k']],
    label: 'Route productivity label',
  },
  routeSettings: {
    binding: 'command+shift+l',
    keys: [['command', 'shift', 'l']],
    label: 'Route settings label',
  },
  skipBreak: {
    binding: 'command+shift+m',
    keys: [['command', 'shift', 'm']],
    label: 'Skip break label',
  },
  startTimer: {
    binding: 'command+shift+n',
    keys: [['command', 'shift', 'n']],
    label: 'Start timer label',
  },
  switchTask: {
    binding: 'command+shift+o',
    keys: [['command', 'shift', 'o']],
    label: 'Switch task label',
  },
  toggleMenu: {
    binding: 'command+shift+p',
    keys: [['command', 'shift', 'p']],
    label: 'Toggle menu label',
  },
  voidTask: {
    binding: 'command+shift+q',
    keys: [['command', 'shift', 'q']],
    label: 'Void task label',
  },
};
