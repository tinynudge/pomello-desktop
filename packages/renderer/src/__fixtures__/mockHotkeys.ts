import { LabeledHotkeys } from '@domain';

const mockHotkeys: LabeledHotkeys = {
  addNote: {
    binding: 'command+shift+a',
    label: 'Add note label',
  },
  completeTaskEarly: {
    binding: 'command+shift+b',
    label: 'Complete task early label',
  },
  continueTask: {
    binding: 'command+shift+c',
    label: 'Continue task label',
  },
  createTask: {
    binding: 'command+shift+d',
    label: 'Create task label',
  },
  externalDistraction: {
    binding: 'command+shift+e',
    label: 'External distraction label',
  },
  internalDistraction: {
    binding: 'command+shift+f',
    label: 'Internal distraction label',
  },
  moveTask: {
    binding: 'command+shift+g',
    label: 'Move task label',
  },
  openInBrowser: {
    binding: 'command+shift+h',
    label: 'Open in browser label',
  },
  pauseTimer: {
    binding: 'command+shift+i',
    label: 'Pause timer label',
  },
  routeHome: {
    binding: 'command+shift+j',
    label: 'Route home label',
  },
  routeProductivity: {
    binding: 'command+shift+k',
    label: 'Route productivity label',
  },
  routeSettings: {
    binding: 'command+shift+l',
    label: 'Route settings label',
  },
  skipBreak: {
    binding: 'command+shift+m',
    label: 'Skip break label',
  },
  startTimer: {
    binding: 'command+shift+n',
    label: 'Start timer label',
  },
  switchTask: {
    binding: 'command+shift+o',
    label: 'Switch task label',
  },
  toggleMenu: {
    binding: 'command+shift+p',
    label: 'Toggle menu label',
  },
  voidTask: {
    binding: 'command+shift+q',
    label: 'Void task label',
  },
};

export default mockHotkeys;
