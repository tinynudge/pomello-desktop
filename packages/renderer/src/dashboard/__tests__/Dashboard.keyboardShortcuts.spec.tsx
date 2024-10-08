import { DashboardRoute } from '@pomello-desktop/domain';
import { fireEvent, renderDashboard, screen, within } from '../__fixtures__/renderDashboard';

describe('Dashboard - Keyboard shortcuts', () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should render the keyboard shortcuts', () => {
    renderDashboard({ route: DashboardRoute.KeyboardShortcuts });

    expect(
      screen.getByRole('heading', { name: 'Keyboard shortcuts', level: 1 })
    ).toBeInTheDocument();
  });

  it('should render the general keyboard shortcuts', () => {
    renderDashboard({
      route: DashboardRoute.KeyboardShortcuts,
    });

    const list = screen.getByRole('list', { name: 'General keyboard shortcuts' });

    expect(screen.getByRole('heading', { name: 'General', level: 2 })).toBeInTheDocument();
    expect(list).toBeInTheDocument();
    expect(within(list).getAllByRole('listitem')).toHaveLength(6);
    expect(within(list).getAllByTestId('form-field-description')).toHaveLength(6);
  });

  it('should render the task timer keyboard shortcuts', () => {
    renderDashboard({
      route: DashboardRoute.KeyboardShortcuts,
    });

    const list = screen.getByRole('list', { name: 'Task timer keyboard shortcuts' });

    expect(screen.getByRole('heading', { name: 'Task timer', level: 2 })).toBeInTheDocument();
    expect(list).toBeInTheDocument();
    expect(within(list).getAllByRole('listitem')).toHaveLength(10);
    expect(within(list).getAllByTestId('form-field-description')).toHaveLength(10);
  });

  it('should render the break timer keyboard shortcuts', () => {
    renderDashboard({
      route: DashboardRoute.KeyboardShortcuts,
    });

    const list = screen.getByRole('list', { name: 'Break timer keyboard shortcuts' });

    expect(screen.getByRole('heading', { name: 'Break timer', level: 2 })).toBeInTheDocument();
    expect(list).toBeInTheDocument();
    expect(within(list).getAllByRole('listitem')).toHaveLength(1);
    expect(within(list).getAllByTestId('form-field-description')).toHaveLength(1);
  });

  it('should show the binding for the given command', async () => {
    renderDashboard({
      hotkeys: {
        addNote: {
          binding: 'command+shift+a',
          keys: [['⌘', '⇧', 'A']],
          label: '⌘ ⇧ A',
        },
        createTask: {
          binding: 'command+k control+z',
          keys: [
            ['⌘', 'K'],
            ['⌃', 'Z'],
          ],
          label: '⌘ K • ⌃ Z',
        },
        toggleMenu: undefined,
      },
      route: DashboardRoute.KeyboardShortcuts,
    });

    const addNoteListItem = screen.getByRole('listitem', { name: 'Add note' });
    const addNoteButton = within(addNoteListItem).getByRole('button', { name: /Edit/ });
    const createTaskListItem = screen.getByRole('listitem', { name: 'Create task' });
    const createTaskButton = within(createTaskListItem).getByRole('button', { name: /Edit/ });
    const toggleMenuListItem = screen.getByRole('listitem', { name: 'Toggle menu' });
    const toggleMenuButton = within(toggleMenuListItem).getByRole('button', { name: /Set/ });

    expect(addNoteButton).toHaveAccessibleName(
      'Edit keyboard shortcut for: Add note. Current keyboard shortcut: ⌘ ⇧ A.'
    );
    expect(addNoteButton).toHaveTextContent('⌘⇧A');

    expect(createTaskButton).toHaveAccessibleName(
      'Edit keyboard shortcut for: Create task. Current keyboard shortcut: ⌘ K • ⌃ Z.'
    );
    expect(createTaskButton).toHaveTextContent('⌘K•⌃Z');

    expect(toggleMenuButton).toHaveAccessibleName(
      'No keyboard shortcut set for: Toggle menu. Set keyboard shortcut.'
    );
    expect(toggleMenuButton).toHaveTextContent('None');
  });

  it('should restore a binding to its default', async () => {
    const { appApi, userEvent } = renderDashboard({
      hotkeys: {
        routeSettings: {
          binding: 's s',
          keys: [['s'], ['s']],
          label: 'S S',
        },
      },
      route: DashboardRoute.KeyboardShortcuts,
    });

    const viewSettingsItem = screen.getByRole('listitem', { name: 'View settings' });

    await userEvent.click(
      within(viewSettingsItem).getByRole('button', { name: 'Show more options' })
    );
    await userEvent.click(screen.getByRole('menuitem', { name: /Restore default/ }));

    expect(within(viewSettingsItem).getByRole('button', { name: /Edit/ })).toHaveTextContent('⌘⇧L');
    expect(appApi.updateHotkeys).not.toHaveBeenCalled();
    expect(screen.getByRole('status')).toHaveTextContent(
      'Your pending changes have not been saved yet.'
    );

    await userEvent.click(screen.getByRole('button', { name: 'Save changes' }));

    expect(appApi.updateHotkeys).toHaveBeenCalledOnce();
    expect(appApi.updateHotkeys).toHaveBeenCalledWith({ routeSettings: 'command+shift+l' });
  });

  it('should unset a binding', async () => {
    const { appApi, userEvent } = renderDashboard({
      hotkeys: {
        routeSettings: {
          binding: 's s',
          keys: [['s'], ['s']],
          label: 'S S',
        },
      },
      route: DashboardRoute.KeyboardShortcuts,
    });

    const viewSettingsItem = screen.getByRole('listitem', { name: 'View settings' });

    await userEvent.click(
      within(viewSettingsItem).getByRole('button', { name: 'Show more options' })
    );
    await userEvent.click(screen.getByRole('menuitem', { name: 'Unset keyboard shortcut' }));

    expect(within(viewSettingsItem).getByRole('button', { name: /Set/ })).toHaveTextContent('None');
    expect(appApi.updateHotkeys).not.toHaveBeenCalled();
    expect(screen.getByRole('status')).toHaveTextContent(
      'Your pending changes have not been saved yet.'
    );

    await userEvent.click(screen.getByRole('button', { name: 'Save changes' }));

    expect(appApi.updateHotkeys).toHaveBeenCalledOnce();
    expect(appApi.updateHotkeys).toHaveBeenCalledWith({ routeSettings: false });
  });

  it('should show the conflict modal when restoring a default binding', async () => {
    const { appApi, userEvent } = renderDashboard({
      hotkeys: {
        skipBreak: {
          binding: 's b',
          keys: [['S'], ['B']],
          label: 'S•B',
        },
        startTimer: {
          binding: 'command+shift+m',
          keys: [['⌘', '⇧', 'M']],
          label: '⌘ ⇧ M',
        },
      },
      route: DashboardRoute.KeyboardShortcuts,
    });

    const skipBreakItem = screen.getByRole('listitem', { name: 'Skip break' });

    await userEvent.click(within(skipBreakItem).getByRole('button', { name: 'Show more options' }));
    await userEvent.click(screen.getByRole('menuitem', { name: /Restore default/ }));

    const hotkeyConflictModal = screen.getByRole('dialog', {
      name: 'Conflicting keyboard shortcut',
    });

    expect(hotkeyConflictModal).toBeInTheDocument();
    expect(
      within(hotkeyConflictModal).getByRole('heading', { name: 'Conflicting keyboard shortcut' })
    ).toBeInTheDocument();
    expect(within(hotkeyConflictModal).getByRole('paragraph')).toHaveTextContent(
      '"⌘ ⇧ M" is currently assigned to "Start timer." Click "Overwrite" to reassign it to "Skip break," or click "Cancel" to keep your existing keyboard shortcuts.'
    );
    expect(appApi.updateHotkeys).not.toHaveBeenCalled();
    expect(screen.queryByRole('status')).not.toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(within(skipBreakItem).getByRole('button', { name: /Edit/ })).toHaveTextContent('S•B');

    await userEvent.click(within(skipBreakItem).getByRole('button', { name: 'Show more options' }));
    await userEvent.click(screen.getByRole('menuitem', { name: /Restore default/ }));
    await userEvent.click(screen.getByRole('button', { name: 'Overwrite' }));

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(within(skipBreakItem).getByRole('button', { name: /Edit/ })).toHaveTextContent('⌘⇧M');
    expect(screen.getByRole('button', { name: /Start timer/ })).toHaveTextContent('None');
  });

  it('should record a new keyboard shortcut', async () => {
    const { userEvent } = renderDashboard({
      route: DashboardRoute.KeyboardShortcuts,
    });

    const voidTaskItem = screen.getByRole('listitem', { name: 'Void task' });

    await userEvent.click(within(voidTaskItem).getByRole('button', { name: /Void task/ }));

    const recordingInput = screen.getByRole('textbox', { name: 'Keyboard shortcut recorder' });
    expect(recordingInput).toHaveFocus();

    // Mousetrap uses the deprecated event.which so we can't use userEvent.type here
    fireEvent(recordingInput, new KeyboardEvent('keydown', { which: 76 })); // L
    fireEvent(recordingInput, new KeyboardEvent('keyup'));

    vi.runOnlyPendingTimers();

    expect(within(voidTaskItem).getByRole('button', { name: /Void task/ })).toHaveTextContent('L');
    expect(screen.getByRole('status')).toHaveTextContent(
      'Your pending changes have not been saved yet.'
    );
  });

  it('should show the conflict modal when recording a keyboard shortcut', async () => {
    const { userEvent } = renderDashboard({
      hotkeys: {
        toggleMenu: {
          binding: 'm',
          keys: [['M']],
          label: 'M',
        },
      },
      route: DashboardRoute.KeyboardShortcuts,
    });

    const moveTaskItem = screen.getByRole('listitem', { name: 'Move task' });

    await userEvent.click(within(moveTaskItem).getByRole('button', { name: /Move task/ }));

    const recordingInput = screen.getByRole('textbox', { name: 'Keyboard shortcut recorder' });
    expect(recordingInput).toHaveFocus();

    // Mousetrap uses the deprecated event.which so we can't use userEvent.type here
    fireEvent(recordingInput, new KeyboardEvent('keydown', { which: 77 })); // M
    fireEvent(recordingInput, new KeyboardEvent('keyup'));

    vi.runOnlyPendingTimers();

    const hotkeyConflictModal = screen.getByRole('dialog', {
      name: 'Conflicting keyboard shortcut',
    });

    expect(hotkeyConflictModal).toBeInTheDocument();
    expect(
      within(hotkeyConflictModal).getByRole('heading', { name: 'Conflicting keyboard shortcut' })
    ).toBeInTheDocument();
    expect(within(hotkeyConflictModal).getByRole('paragraph')).toHaveTextContent(
      '"M" is currently assigned to "Toggle menu." Click "Overwrite" to reassign it to "Move task," or click "Cancel" to keep your existing keyboard shortcuts.'
    );
  });
});
