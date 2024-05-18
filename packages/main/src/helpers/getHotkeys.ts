import runtime from '@/runtime';
import { Hotkeys, Store } from '@pomello-desktop/domain';

type HotkeyDefaults = Record<keyof Hotkeys, PlatformValue | string>;

type PlatformValue = Record<'linux' | 'mac' | 'windows', string>;

const hotkeyDefaults: HotkeyDefaults = {
  addNote: {
    linux: 'meta+n',
    mac: 'command+n',
    windows: 'ctrl+n',
  },
  completeTaskEarly: {
    linux: 'meta+shift+d',
    mac: 'command+shift+d',
    windows: 'ctrl+shift+d',
  },
  continueTask: 'c',
  createTask: {
    linux: 'meta+shift+n',
    mac: 'command+shift+n',
    windows: 'ctrl+shift+n',
  },
  externalDistraction: {
    linux: 'meta+-',
    mac: 'command+-',
    windows: 'ctrl+-',
  },
  internalDistraction: {
    linux: "meta+'",
    mac: "command+'",
    windows: "ctrl+'",
  },
  moveTask: 'd',
  openInBrowser: {
    linux: 'meta+o',
    mac: 'command+o',
    windows: 'ctrl+o',
  },
  pauseTimer: {
    linux: 'meta+shift+space',
    mac: 'command+shift+space',
    windows: 'ctrl+shift+space',
  },
  routeHome: 'home',
  routeProductivity: {
    linux: 'meta+.',
    mac: 'command+.',
    windows: 'ctrl+.',
  },
  routeSettings: {
    linux: 'meta+,',
    mac: 'command+,',
    windows: 'ctrl+,',
  },
  skipBreak: {
    linux: 'meta+k',
    mac: 'command+k',
    windows: 'ctrl+k',
  },
  startTimer: 'space',
  switchTask: {
    linux: 'meta+shift+i',
    mac: 'command+shift+i',
    windows: 'ctrl+shift+i',
  },
  toggleMenu: 'm',
  voidTask: {
    linux: 'meta+\\',
    mac: 'command+\\',
    windows: 'ctrl+\\',
  },
};

const platform =
  process.platform === 'darwin' ? 'mac' : process.platform === 'win32' ? 'windows' : 'linux';

const platformDefaults = Object.entries(hotkeyDefaults).reduce(
  (hotkeys, [command, hotkey]) => ({
    ...hotkeys,
    [command]: typeof hotkey === 'string' ? hotkey : hotkey[platform],
  }),
  {} as Hotkeys
);

const getHotkeys = (): Store<Hotkeys> => {
  return runtime.storeManager.registerStore<Hotkeys>({
    path: 'bindings',
    defaults: platformDefaults,
    schema: {
      type: 'object',
      properties: {
        addNote: { oneOf: [{ type: 'string' }, { type: 'boolean' }] },
        completeTaskEarly: { oneOf: [{ type: 'string' }, { type: 'boolean' }] },
        continueTask: { oneOf: [{ type: 'string' }, { type: 'boolean' }] },
        createTask: { oneOf: [{ type: 'string' }, { type: 'boolean' }] },
        externalDistraction: { oneOf: [{ type: 'string' }, { type: 'boolean' }] },
        internalDistraction: { oneOf: [{ type: 'string' }, { type: 'boolean' }] },
        moveTask: { oneOf: [{ type: 'string' }, { type: 'boolean' }] },
        openInBrowser: { oneOf: [{ type: 'string' }, { type: 'boolean' }] },
        pauseTimer: { oneOf: [{ type: 'string' }, { type: 'boolean' }] },
        routeHome: { oneOf: [{ type: 'string' }, { type: 'boolean' }] },
        routeProductivity: { oneOf: [{ type: 'string' }, { type: 'boolean' }] },
        routeSettings: { oneOf: [{ type: 'string' }, { type: 'boolean' }] },
        skipBreak: { oneOf: [{ type: 'string' }, { type: 'boolean' }] },
        startTimer: { oneOf: [{ type: 'string' }, { type: 'boolean' }] },
        switchTask: { oneOf: [{ type: 'string' }, { type: 'boolean' }] },
        toggleMenu: { oneOf: [{ type: 'string' }, { type: 'boolean' }] },
        voidTask: { oneOf: [{ type: 'string' }, { type: 'boolean' }] },
      },
      required: [
        'addNote',
        'completeTaskEarly',
        'continueTask',
        'createTask',
        'externalDistraction',
        'internalDistraction',
        'moveTask',
        'openInBrowser',
        'pauseTimer',
        'routeHome',
        'routeProductivity',
        'routeSettings',
        'skipBreak',
        'startTimer',
        'switchTask',
        'toggleMenu',
        'voidTask',
      ],
    },
  });
};

export default getHotkeys;
