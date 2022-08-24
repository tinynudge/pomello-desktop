import { Hotkeys } from '@domain';
import { act } from 'react-dom/test-utils';
import { fireEvent, MountAppResults, screen } from './mountApp';

const sleep = (timeout: number) =>
  new Promise<void>(resolve => {
    setTimeout(resolve, timeout);
  });

const enterNote = async ({ userEvent }: MountAppResults, note: string) => {
  await screen.findByRole('textbox');

  await userEvent.type(screen.getByRole('textbox'), note);
};

const hideDialActions = async ({ userEvent }: MountAppResults) => {
  await userEvent.click(screen.getByRole('button', { name: 'Hide actions' }));
};

const hotkey = async (_results: MountAppResults, command: keyof Hotkeys) => {
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

  await act(async () => {
    fireEvent.keyDown(document, {
      metaKey: true,
      shiftKey: true,
      which: keyCodes[command],
    });

    await sleep(1);
  });
};

const selectService = async (results: MountAppResults, serviceId: string) => {
  await selectOption(results, serviceId);

  await act(async () => {
    results.emitAppApiEvent('onServicesChange', {
      activeServiceId: serviceId,
    });

    await sleep(1);
  });
};

const selectOption = async ({ emitAppApiEvent }: MountAppResults, optionId: string) => {
  await act(async () => {
    emitAppApiEvent('onSelectChange', optionId);

    await sleep(1);
  });
};

const selectTask = async (results: MountAppResults, taskId: string = 'one') => {
  await screen.findByRole('button', { name: 'Pick a task' });

  await sleep(1);

  await selectOption(results, taskId);
};

const showDialActions = async ({ userEvent }: MountAppResults) => {
  await userEvent.click(screen.getByRole('button', { name: 'Show actions' }));
};

const startTimer = async ({ userEvent }: MountAppResults) => {
  const startTimerButton = await screen.findByRole('button', { name: 'Start timer' });

  await userEvent.click(startTimerButton);
};

const simulate = {
  enterNote,
  hideDialActions,
  hotkey,
  selectOption,
  selectService,
  selectTask,
  showDialActions,
  startTimer,
};

export default simulate;
