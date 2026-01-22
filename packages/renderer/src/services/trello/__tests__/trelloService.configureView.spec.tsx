import {
  screen,
  waitForElementToBeRemoved,
  within,
} from '@/dashboard/__fixtures__/renderDashboard';
import { QueryClient } from '@tanstack/solid-query';
import { HttpResponse } from 'msw';
import { generateTrelloBoard } from '../__fixtures__/generateTrelloBoard';
import { generateTrelloList } from '../__fixtures__/generateTrelloList';
import { generateTrelloMember } from '../__fixtures__/generateTrelloMember';
import { renderTrelloConfigureView } from '../__fixtures__/renderTrelloConfigureView';

vi.mock('../createTrelloQueryClient', () => ({
  createTrelloQueryClient: () =>
    new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    }),
}));

describe('Trello service - Configure view', () => {
  it('should render the configure view', async () => {
    await renderTrelloConfigureView();

    expect(screen.getByRole('heading', { name: 'Trello', level: 1 })).toBeInTheDocument();
  });

  it('should render the connection status', async () => {
    const { appApi, config, userEvent } = await renderTrelloConfigureView({
      config: {
        token: undefined,
      },
    });

    const connectionSection = within(screen.getByRole('region', { name: 'Account Connection' }));

    expect(
      connectionSection.getByRole('heading', { name: 'Account Connection', level: 2 })
    ).toBeInTheDocument();
    expect(connectionSection.getByText('Status: Not connected')).toBeInTheDocument();
    expect(connectionSection.getByRole('button', { name: 'Login' })).toBeInTheDocument();

    await userEvent.click(connectionSection.getByRole('button', { name: 'Login' }));

    expect(appApi.showAuthWindow).toHaveBeenCalledWith({
      serviceId: 'trello',
      type: 'service',
    });

    config.set('token', 'mock-token');

    expect(connectionSection.getByText('Status: Connected')).toBeInTheDocument();
    expect(connectionSection.getByRole('button', { name: 'Logout' })).toBeInTheDocument();
  });

  it('should render the global preferences with default values', async () => {
    await renderTrelloConfigureView({
      config: {
        preferences: {},
      },
    });

    expect(
      screen.getByRole('heading', { name: 'Default Preferences', level: 2 })
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'Customize individual preferences for boards and lists. List preferences will override board preferences, and board preferences will override default preferences. Changes take effect when you restart Pomello.'
      )
    ).toBeInTheDocument();

    const list = screen.getByRole('list', { name: 'Default Preferences' });

    const addMarkerCheckbox = within(list).getByRole('checkbox', {
      name: 'Add marker to card title',
    });

    expect(addMarkerCheckbox).toBeInTheDocument();
    expect(addMarkerCheckbox).toBeChecked();

    const logEventsCheckbox = within(list).queryByRole('checkbox', {
      name: 'Log events in card comment',
    });
    expect(logEventsCheckbox).toBeInTheDocument();
    expect(logEventsCheckbox).toBeChecked();

    const trackProductivityCheckbox = within(list).queryByRole('checkbox', {
      name: 'Track productivity through Pomello',
    });
    expect(trackProductivityCheckbox).toBeInTheDocument();
    expect(trackProductivityCheckbox).toBeChecked();

    const archiveCardCheckbox = within(list).queryByRole('checkbox', {
      name: 'Archive card after moving',
    });
    expect(archiveCardCheckbox).not.toBeChecked();
  });

  it('should render the global preferences with custom values', async () => {
    await renderTrelloConfigureView({
      config: {
        preferences: {
          global: {
            addChecks: false,
          },
        },
      },
    });

    const list = screen.getByRole('list', { name: 'Default Preferences' });
    const addMarkerCheckbox = within(list).getByRole('checkbox', {
      name: 'Add marker to card title',
    });

    expect(addMarkerCheckbox).not.toBeChecked();
  });

  it('should be able to change global preferences', async () => {
    const { config, userEvent } = await renderTrelloConfigureView({
      config: {
        preferences: {
          global: {
            archiveCards: true,
          },
        },
      },
    });

    const list = screen.getByRole('list', { name: 'Default Preferences' });
    const archiveCardCheckbox = within(list).getByRole('checkbox', {
      name: 'Archive card after moving',
    });

    expect(archiveCardCheckbox).toBeChecked();

    await userEvent.click(archiveCardCheckbox);

    expect(config.get().preferences?.global?.archiveCards).toBe(true);
    expect(screen.getByRole('status')).toHaveTextContent(
      'Your pending changes have not been saved yet.'
    );

    await userEvent.click(screen.getByRole('button', { name: 'Save changes' }));

    expect(screen.queryByRole('status')).not.toBeInTheDocument();
    expect(config.get().preferences?.global?.archiveCards).toBe(false);
  });

  it('should be able to reset global preferences to their default values', async () => {
    const { config, userEvent } = await renderTrelloConfigureView({
      config: {
        preferences: {
          global: {
            keepLogs: false,
          },
        },
      },
    });

    const list = screen.getByRole('list', { name: 'Default Preferences' });
    const logEventsItem = within(list).getByRole('listitem', {
      name: 'Log events in card comment',
    });
    const logEventsCheckbox = within(logEventsItem).getByRole('checkbox');

    expect(logEventsCheckbox).not.toBeChecked();

    await userEvent.click(within(logEventsItem).getByRole('button', { name: 'Show more options' }));
    await userEvent.click(within(logEventsItem).getByRole('menuitem', { name: /Restore default/ }));

    expect(logEventsCheckbox).toBeChecked();
    expect(config.get().preferences?.global?.keepLogs).toBe(false);

    expect(screen.getByRole('status')).toHaveTextContent(
      'Your pending changes have not been saved yet.'
    );

    await userEvent.click(screen.getByRole('button', { name: 'Save changes' }));

    expect(screen.queryByRole('status')).not.toBeInTheDocument();
    expect(config.get().preferences?.global?.keepLogs).toBe(true);
  });

  it('should show a login prompt in the boards and lists preferences panel when not connected', async () => {
    const { appApi, config, userEvent } = await renderTrelloConfigureView({
      config: {
        token: undefined,
      },
    });

    const boardListPreferencesSection = within(
      screen.getByRole('region', {
        name: 'Board and List Preferences',
      })
    );

    expect(
      boardListPreferencesSection.getByText(
        'You must connect your Trello account to view your board and list preferences.'
      )
    ).toBeInTheDocument();

    const loginButton = boardListPreferencesSection.getByRole('button', { name: 'Login' });
    expect(loginButton).toBeInTheDocument();

    await userEvent.click(loginButton);

    expect(appApi.showAuthWindow).toHaveBeenCalledWith({
      serviceId: 'trello',
      type: 'service',
    });

    config.set('token', 'mock-token');

    expect(
      boardListPreferencesSection.queryByText(
        'You must connect your Trello account to view your board and list preferences.'
      )
    ).not.toBeInTheDocument();
  });

  it('should show a loading state in the boards and lists preferences panel', async () => {
    let settlePromise = () => {};
    const fetchBoardsAndListsPromise = new Promise<void>(resolve => (settlePromise = resolve));

    await renderTrelloConfigureView({
      trelloApi: {
        fetchBoardsAndLists: async () => {
          await fetchBoardsAndListsPromise;

          return HttpResponse.json(generateTrelloMember());
        },
      },
    });

    const boardListPreferencesSection = within(
      screen.getByRole('region', { name: 'Board and List Preferences' })
    );

    expect(
      boardListPreferencesSection.getByRole('status', { name: 'Loading' })
    ).toBeInTheDocument();

    settlePromise();

    await waitForElementToBeRemoved(() =>
      boardListPreferencesSection.queryByRole('status', { name: 'Loading' })
    );
  });

  it('should handle errors when loading the boards and lists preferences', async () => {
    const fetchBoardsAndLists = vi.fn().mockRejectedValue(new Error('💣'));

    const { appApi, userEvent } = await renderTrelloConfigureView({
      trelloApi: {
        fetchBoardsAndLists,
      },
    });

    const boardListPreferencesSection = within(
      screen.getByRole('region', { name: 'Board and List Preferences' })
    );

    expect(
      boardListPreferencesSection.getByText('Unable to fetch Trello boards and lists')
    ).toBeInTheDocument();
    expect(boardListPreferencesSection.getByRole('button', { name: 'Retry' })).toBeInTheDocument();
    expect(
      boardListPreferencesSection.getByRole('button', { name: 'Details' })
    ).toBeInTheDocument();

    await userEvent.click(boardListPreferencesSection.getByRole('button', { name: 'Retry' }));

    expect(fetchBoardsAndLists).toHaveBeenCalledTimes(2);

    await userEvent.click(boardListPreferencesSection.getByRole('button', { name: 'Details' }));

    expect(appApi.showMessageBox).toHaveBeenCalled();
  });

  it('should render the boards and lists', async () => {
    const member = generateTrelloMember({
      boards: [
        generateTrelloBoard({
          id: 'become-a-billionaire',
          name: 'Become a billionaire',
          lists: [
            generateTrelloList({ id: 'ideas', name: 'Ideas' }),
            generateTrelloList({ id: 'done', name: 'Done' }),
          ],
        }),
      ],
    });

    const { userEvent } = await renderTrelloConfigureView({
      trelloApi: {
        fetchBoardsAndLists: member,
      },
    });

    const boardListPreferences = within(
      screen.getByRole('region', { name: 'Board and List Preferences' })
    );

    const boardHeading = boardListPreferences.getByRole('heading', {
      name: 'Become a billionaire',
    });

    expect(
      within(boardHeading).getByRole('button', { name: 'Board preferences' })
    ).toBeInTheDocument();
    expect(
      within(boardHeading).getByRole('button', { name: 'Show more actions' })
    ).toBeInTheDocument();

    expect(screen.queryByRole('region', { name: 'Become a billionaire' })).not.toBeInTheDocument();

    await userEvent.click(
      within(boardHeading).getByRole('button', { name: 'Become a billionaire' })
    );

    expect(screen.getByRole('region', { name: 'Become a billionaire' })).toBeInTheDocument();
    expect(
      screen.getByRole('list', { name: 'Lists for board Become a billionaire' })
    ).toBeInTheDocument();

    const ideasListItem = screen.getByRole('listitem', { name: 'Ideas' });

    expect(
      within(ideasListItem).getByRole('button', { name: 'List preferences' })
    ).toBeInTheDocument();
    expect(
      within(ideasListItem).getByRole('button', { name: 'Show more actions' })
    ).toBeInTheDocument();
  });

  it('should allow updating the board preferences', async () => {
    const { config, userEvent } = await renderTrelloConfigureView({
      config: {
        preferences: {},
      },
      trelloApi: {
        fetchBoardsAndLists: generateTrelloMember({
          boards: [generateTrelloBoard({ id: 'board-1', name: 'Board 1' })],
        }),
      },
    });

    await userEvent.click(
      within(screen.getByRole('heading', { name: 'Board 1' })).getByRole('button', {
        name: 'Board preferences',
      })
    );

    expect(screen.getByRole('dialog', { name: 'Board Preferences: Board 1' })).toBeInTheDocument();

    await userEvent.selectOptions(
      screen.getByRole('combobox', { name: 'Add marker to card title' }),
      'disabled'
    );
    await userEvent.selectOptions(
      screen.getByRole('combobox', { name: 'Log events in card comment' }),
      'enabled'
    );
    await userEvent.click(screen.getByRole('button', { name: 'Done' }));

    expect(
      screen.queryByRole('dialog', { name: 'Board Preferences: Board 1' })
    ).not.toBeInTheDocument();

    expect(config.get().preferences).toMatchObject({
      boards: {
        'board-1': {
          addChecks: false,
          keepLogs: true,
        },
      },
    });
  });

  it('should not update board preferences when cancelling', async () => {
    const { config, userEvent } = await renderTrelloConfigureView({
      config: {
        preferences: {},
      },
      trelloApi: {
        fetchBoardsAndLists: generateTrelloMember({
          boards: [generateTrelloBoard({ id: 'board-1', name: 'Board 1' })],
        }),
      },
    });

    await userEvent.click(
      within(screen.getByRole('heading', { name: 'Board 1' })).getByRole('button', {
        name: 'Board preferences',
      })
    );

    expect(screen.getByRole('dialog', { name: 'Board Preferences: Board 1' })).toBeInTheDocument();

    await userEvent.selectOptions(
      screen.getByRole('combobox', { name: 'Add marker to card title' }),
      'disabled'
    );
    await userEvent.selectOptions(
      screen.getByRole('combobox', { name: 'Log events in card comment' }),
      'enabled'
    );
    await userEvent.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(
      screen.queryByRole('dialog', { name: 'Board Preferences: Board 1' })
    ).not.toBeInTheDocument();

    expect(config.get().preferences).toMatchObject({});
  });

  it('should remove the board preferences when resetting to default', async () => {
    const { config, userEvent } = await renderTrelloConfigureView({
      config: {
        preferences: {
          boards: {
            'board-1': {
              addChecks: false,
              archiveCards: true,
            },
          },
        },
      },
      trelloApi: {
        fetchBoardsAndLists: generateTrelloMember({
          boards: [generateTrelloBoard({ id: 'board-1', name: 'Board 1' })],
        }),
      },
    });

    await userEvent.click(
      within(screen.getByRole('heading', { name: 'Board 1' })).getByRole('button', {
        name: 'Board preferences',
      })
    );

    await userEvent.selectOptions(
      screen.getByRole('combobox', { name: 'Add marker to card title' }),
      'default'
    );

    await userEvent.selectOptions(
      screen.getByRole('combobox', { name: 'Archive card after moving' }),
      'default'
    );

    await userEvent.click(screen.getByRole('button', { name: 'Done' }));

    expect(config.get().preferences?.boards).toBeUndefined();
  });

  it('should allow updating the list preferences', async () => {
    const { config, userEvent } = await renderTrelloConfigureView({
      config: {
        preferences: {},
      },
      trelloApi: {
        fetchBoardsAndLists: generateTrelloMember({
          boards: [
            generateTrelloBoard({
              id: 'board-1',
              name: 'Board 1',
              lists: [generateTrelloList({ id: 'list-1', name: 'List 1' })],
            }),
          ],
        }),
      },
    });

    await userEvent.click(screen.getByRole('button', { name: 'Board 1' }));

    await userEvent.click(
      within(screen.getByRole('listitem', { name: 'List 1' })).getByRole('button', {
        name: 'List preferences',
      })
    );

    expect(screen.getByRole('dialog', { name: 'List Preferences: List 1' })).toBeInTheDocument();

    await userEvent.selectOptions(
      screen.getByRole('combobox', { name: 'Add marker to card title' }),
      'disabled'
    );
    await userEvent.selectOptions(
      screen.getByRole('combobox', { name: 'Log events in card comment' }),
      'enabled'
    );
    await userEvent.click(screen.getByRole('button', { name: 'Done' }));

    expect(
      screen.queryByRole('dialog', { name: 'List Preferences: List 1' })
    ).not.toBeInTheDocument();

    expect(config.get().preferences).toMatchObject({
      lists: {
        'list-1': {
          addChecks: false,
          keepLogs: true,
        },
      },
    });
  });

  it('should not update list preferences when cancelling', async () => {
    const { config, userEvent } = await renderTrelloConfigureView({
      config: {
        preferences: {},
      },
      trelloApi: {
        fetchBoardsAndLists: generateTrelloMember({
          boards: [
            generateTrelloBoard({
              id: 'board-1',
              name: 'Board 1',
              lists: [generateTrelloList({ id: 'list-1', name: 'List 1' })],
            }),
          ],
        }),
      },
    });

    await userEvent.click(screen.getByRole('button', { name: 'Board 1' }));

    await userEvent.click(
      within(screen.getByRole('listitem', { name: 'List 1' })).getByRole('button', {
        name: 'List preferences',
      })
    );

    expect(screen.getByRole('dialog', { name: 'List Preferences: List 1' })).toBeInTheDocument();

    await userEvent.selectOptions(
      screen.getByRole('combobox', { name: 'Add marker to card title' }),
      'disabled'
    );
    await userEvent.selectOptions(
      screen.getByRole('combobox', { name: 'Log events in card comment' }),
      'enabled'
    );
    await userEvent.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(
      screen.queryByRole('dialog', { name: 'List Preferences: List 1' })
    ).not.toBeInTheDocument();

    expect(config.get().preferences).toMatchObject({});
  });

  it('should remove the list preferences when resetting to default', async () => {
    const { config, userEvent } = await renderTrelloConfigureView({
      config: {
        preferences: {
          lists: {
            'list-1': {
              addChecks: false,
              archiveCards: true,
            },
          },
        },
      },
      trelloApi: {
        fetchBoardsAndLists: generateTrelloMember({
          boards: [
            generateTrelloBoard({
              id: 'board-1',
              name: 'Board 1',
              lists: [generateTrelloList({ id: 'list-1', name: 'List 1' })],
            }),
          ],
        }),
      },
    });

    await userEvent.click(screen.getByRole('button', { name: 'Board 1' }));

    await userEvent.click(
      within(screen.getByRole('listitem', { name: 'List 1' })).getByRole('button', {
        name: 'List preferences',
      })
    );

    await userEvent.selectOptions(
      screen.getByRole('combobox', { name: 'Add marker to card title' }),
      'default'
    );

    await userEvent.selectOptions(
      screen.getByRole('combobox', { name: 'Archive card after moving' }),
      'default'
    );

    await userEvent.click(screen.getByRole('button', { name: 'Done' }));

    expect(config.get().preferences?.lists).toBeUndefined();
  });
});
