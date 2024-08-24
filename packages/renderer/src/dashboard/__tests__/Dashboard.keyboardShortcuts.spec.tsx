import { DashboardRoute } from '@pomello-desktop/domain';
import { renderDashboard, screen, within } from '../__fixtures__/renderDashboard';

describe('Dashboard - Keyboard shortcuts', () => {
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
});
