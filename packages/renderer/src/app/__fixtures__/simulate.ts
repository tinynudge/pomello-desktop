import { MockAppEventEmitter } from '@/__fixtures__/createMockAppApi';
import { Hotkeys } from '@pomello-desktop/domain';
import { UserEvent } from '@testing-library/user-event';
import { vi } from 'vitest';
import { tickTimer } from './mockPomelloServiceTicker';
import { fireEvent, screen } from './renderApp';

type RenderAppContext = {
  appApi: AppApi;
  emitAppApiEvent: MockAppEventEmitter;
  userEvent: UserEvent;
};

const sleep = (timeout: number) =>
  new Promise<void>(resolve => {
    setTimeout(resolve, timeout);
  });

const advanceTimer = async (_results: RenderAppContext, time: number) => {
  let count = 0;

  const isFakeTimers = vi.isFakeTimers();

  while (time > count) {
    tickTimer();

    if (isFakeTimers) {
      vi.advanceTimersByTime(1000);
    }

    count += 1;
  }
};

const clickMenuButton = async (
  { userEvent }: RenderAppContext,
  button: 'createTask' | 'home' | 'settings'
) => {
  const buttonNames = {
    createTask: 'Create task',
    home: 'Home',
    settings: 'Settings',
  };

  await userEvent.click(screen.getByRole('button', { name: buttonNames[button] }));
};

const enterNote = async ({ userEvent }: RenderAppContext, note: string) => {
  await screen.findByRole('textbox');

  await userEvent.type(screen.getByRole('textbox'), note);
};

const hideDialActions = async ({ userEvent }: RenderAppContext) => {
  await userEvent.click(screen.getByRole('button', { name: 'Hide actions' }));
};

const hotkey = async (_results: RenderAppContext, command: keyof Hotkeys) => {
  const keyCodes: Record<keyof Hotkeys, number> = {
    addNote: 65, // A
    completeTaskEarly: 66, // B
    continueTask: 67, // C
    createTask: 68, // D
    externalDistraction: 69, // E
    internalDistraction: 70, // F
    moveTask: 71, // G
    openInBrowser: 72, // H
    pauseTimer: 73, // I
    routeHome: 74, // J
    routeProductivity: 75, // K
    routeSettings: 76, // L
    skipBreak: 77, // M
    startTimer: 78, // N
    switchTask: 79, // O
    toggleMenu: 80, // P
    voidTask: 81, // Q
  };

  fireEvent.keyDown(document, {
    metaKey: true,
    shiftKey: true,
    which: keyCodes[command],
  });

  await sleep(1);
};

const openMenu = async ({ userEvent }: RenderAppContext) => {
  await userEvent.click(screen.getByRole('button', { name: 'Open menu' }));
};

const selectService = async (results: RenderAppContext, serviceId: string) => {
  await selectOption(results, serviceId);

  results.emitAppApiEvent('onServicesChange', {
    activeServiceId: serviceId,
  });

  await sleep(1);
};

const selectOption = async ({ emitAppApiEvent }: RenderAppContext, optionId: string) => {
  emitAppApiEvent('onSelectChange', optionId);

  await sleep(1);
};

const selectTask = async (results: RenderAppContext, taskId: string = 'one') => {
  await waitForSelectTaskView();

  await sleep(1);

  await selectOption(results, taskId);
};

const showDialActions = async ({ userEvent }: RenderAppContext) => {
  await userEvent.click(screen.getByRole('button', { name: 'Show actions' }));
};

const startTimer = async ({ userEvent }: RenderAppContext) => {
  const startTimerButton = await screen.findByRole('button', { name: 'Start timer' });

  await userEvent.click(startTimerButton);
};

const switchLists = async (results: RenderAppContext) => {
  await waitForSelectTaskView();

  await sleep(1);

  await selectOption(results, 'switch-lists');
};

const waitForSelectTaskView = async () => {
  await screen.findByRole('button', { name: 'Pick a task' });
};

export const simulate = {
  advanceTimer,
  clickMenuButton,
  enterNote,
  hideDialActions,
  hotkey,
  openMenu,
  selectOption,
  selectService,
  selectTask,
  showDialActions,
  startTimer,
  switchLists,
  waitForSelectTaskView,
};
