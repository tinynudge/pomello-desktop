import { vi } from 'vitest';
import generateTrelloBoard from '../__fixtures__/generateTrelloBoard';
import generateTrelloList from '../__fixtures__/generateTrelloList';
import generateTrelloMember from '../__fixtures__/generateTrelloMember';
import mountTrelloService, { screen, waitFor } from '../__fixtures__/mountTrelloService';

describe('Trello service', () => {
  it('should show the login view if no token is present', async () => {
    await mountTrelloService({
      config: {
        token: undefined,
      },
    });

    await waitFor(() => {
      expect(screen.getByText('Connect to Trello')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Sign in' })).toBeInTheDocument();
    });
  });

  it('should prompt the user to select a list if there is no current list in the config', async () => {
    await mountTrelloService({
      config: {
        currentList: undefined,
        token: 'OPEN_SESAME',
      },
    });

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Pick a list' })).toBeInTheDocument();
    });
  });

  it("should show the user's lists", async () => {
    const { appApi } = await mountTrelloService({
      config: {
        currentList: undefined,
      },
      trelloApi: {
        fetchBoardsAndLists: generateTrelloMember({
          boards: [
            generateTrelloBoard({
              name: 'My tasks',
              lists: [
                generateTrelloList({ id: '1', name: 'Today' }),
                generateTrelloList({ id: '2', name: 'Tomorrow' }),
              ],
            }),
            generateTrelloBoard({
              name: 'House projects',
              lists: [generateTrelloList({ id: '3', name: 'Garage' })],
            }),
          ],
        }),
      },
    });

    await waitFor(() => {
      expect(appApi.setSelectItems).toHaveBeenCalledWith({
        items: [
          { id: '1', label: 'My tasks: Today' },
          { id: '2', label: 'My tasks: Tomorrow' },
          { id: '3', label: 'House projects: Garage' },
        ],
        placeholder: 'Pick a list',
      });
    });
  });

  it('should go directly to the select task view if a current list exists', async () => {
    await mountTrelloService({
      config: {
        currentList: '1',
      },
      trelloApi: {
        fetchBoardsAndLists: generateTrelloMember({
          boards: [
            generateTrelloBoard({
              lists: [generateTrelloList({ id: '1' })],
            }),
          ],
        }),
      },
    });

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Pick a task' }));
    });
  });

  it('should show a message if the existing current list is not valid', async () => {
    const notificationMock = vi.fn();
    vi.stubGlobal('Notification', notificationMock);

    const { config } = await mountTrelloService({
      config: {
        currentList: 'INVALID_LIST',
      },
      trelloApi: {
        fetchBoardsAndLists: generateTrelloMember({
          boards: [
            generateTrelloBoard({
              lists: [generateTrelloList({ id: '1' })],
            }),
          ],
        }),
      },
    });

    await waitFor(() => {
      expect(notificationMock).toHaveBeenCalledWith('Please select a new list', {
        body: 'An issue occurred when loading your previously used list.',
      });

      expect(config.get().currentList).toBeUndefined();
    });
  });

  it('should filter lists', async () => {
    const { appApi } = await mountTrelloService({
      config: {
        currentList: undefined,
        listFilter: '(to)',
      },
      trelloApi: {
        fetchBoardsAndLists: generateTrelloMember({
          boards: [
            generateTrelloBoard({
              name: 'My tasks',
              lists: [
                generateTrelloList({ id: '1', name: 'Today' }),
                generateTrelloList({ id: '2', name: 'Tomorrow' }),
              ],
            }),
            generateTrelloBoard({
              name: 'House projects',
              lists: [
                generateTrelloList({ id: '3', name: 'Garage' }),
                generateTrelloList({ id: '4', name: 'Potato shack' }),
              ],
            }),
          ],
        }),
      },
    });

    await waitFor(() => {
      expect(appApi.setSelectItems).toHaveBeenCalledWith({
        items: [
          { id: '1', label: 'My tasks: Today' },
          { id: '2', label: 'My tasks: Tomorrow' },
          { id: '4', label: 'House projects: Potato shack' },
        ],
        placeholder: 'Pick a list',
      });
    });
  });

  it('should filter lists with case sensitivity', async () => {
    const { appApi } = await mountTrelloService({
      config: {
        currentList: undefined,
        listFilter: '(To)',
        listFilterCaseSensitive: true,
      },
      trelloApi: {
        fetchBoardsAndLists: generateTrelloMember({
          boards: [
            generateTrelloBoard({
              name: 'My tasks',
              lists: [
                generateTrelloList({ id: '1', name: 'Today' }),
                generateTrelloList({ id: '2', name: 'Tomorrow' }),
              ],
            }),
            generateTrelloBoard({
              name: 'House projects',
              lists: [
                generateTrelloList({ id: '3', name: 'Garage' }),
                generateTrelloList({ id: '4', name: 'Potato shack' }),
              ],
            }),
          ],
        }),
      },
    });

    await waitFor(() => {
      expect(appApi.setSelectItems).toHaveBeenCalledWith({
        items: [
          { id: '1', label: 'My tasks: Today' },
          { id: '2', label: 'My tasks: Tomorrow' },
        ],
        placeholder: 'Pick a list',
      });
    });
  });

  it('should sort the lists by most recently used', async () => {
    const { appApi } = await mountTrelloService({
      config: {
        currentList: undefined,
        recentLists: ['4', '2'],
      },
      trelloApi: {
        fetchBoardsAndLists: generateTrelloMember({
          boards: [
            generateTrelloBoard({
              name: 'My tasks',
              lists: [
                generateTrelloList({ id: '1', name: 'Today' }),
                generateTrelloList({ id: '2', name: 'Tomorrow' }),
              ],
            }),
            generateTrelloBoard({
              name: 'House projects',
              lists: [
                generateTrelloList({ id: '3', name: 'Garage' }),
                generateTrelloList({ id: '4', name: 'Potato shack' }),
              ],
            }),
          ],
        }),
      },
    });

    await waitFor(() => {
      expect(appApi.setSelectItems).toHaveBeenCalledWith({
        items: [
          { id: '4', label: 'House projects: Potato shack' },
          { id: '2', label: 'My tasks: Tomorrow' },
          { id: '1', label: 'My tasks: Today' },
          { id: '3', label: 'House projects: Garage' },
        ],
        placeholder: 'Pick a list',
      });
    });
  });

  it('should update the recent lists when a list has been picked', async () => {
    const { config, simulate } = await mountTrelloService({
      config: {
        currentList: undefined,
      },
      trelloApi: {
        fetchBoardsAndLists: generateTrelloMember({
          boards: [
            generateTrelloBoard({
              name: 'My tasks',
              lists: [
                generateTrelloList({ id: '1', name: 'Today' }),
                generateTrelloList({ id: '2', name: 'Tomorrow' }),
              ],
            }),
          ],
        }),
      },
    });

    await screen.findByRole('button', { name: 'Pick a list' });
    await simulate.selectOption('2');

    await waitFor(() => {
      expect(config.get().recentLists).toStrictEqual(['2']);
    });
  });

  it('should use default preferences if none have been set', async () => {
    const { cache, simulate } = await mountTrelloService();

    await simulate.waitForSelectTaskView();

    expect(cache.get().preferences).toStrictEqual({
      addChecks: true,
      keepLogs: true,
      trackStats: true,
      archiveCards: false,
    });
  });

  it('should use global preferences if available', async () => {
    const { cache, simulate } = await mountTrelloService({
      config: {
        preferences: {
          global: {
            addChecks: false,
            trackStats: false,
          },
        },
      },
    });

    await simulate.waitForSelectTaskView();

    expect(cache.get().preferences).toStrictEqual({
      addChecks: false,
      keepLogs: true,
      trackStats: false,
      archiveCards: false,
    });
  });

  it('should use board preferences if available', async () => {
    const { cache, simulate } = await mountTrelloService({
      config: {
        currentList: 'LIST_ID',
        preferences: {
          global: {
            addChecks: false,
            trackStats: false,
          },
          boards: {
            BOARD_ID: {
              addChecks: true,
              archiveCards: true,
            },
          },
        },
      },
      trelloApi: {
        fetchBoardsAndLists: generateTrelloMember({
          boards: [
            generateTrelloBoard({
              id: 'BOARD_ID',
              lists: [generateTrelloList({ idBoard: 'BOARD_ID', id: 'LIST_ID' })],
            }),
          ],
        }),
      },
    });

    await simulate.waitForSelectTaskView();

    expect(cache.get().preferences).toStrictEqual({
      addChecks: true,
      keepLogs: true,
      trackStats: false,
      archiveCards: true,
    });
  });

  it('should use list preferences if available', async () => {
    const { cache, simulate } = await mountTrelloService({
      config: {
        currentList: 'LIST_ID',
        preferences: {
          global: {
            addChecks: false,
            trackStats: false,
          },
          boards: {
            BOARD_ID: {
              addChecks: true,
              archiveCards: true,
            },
          },
          lists: {
            LIST_ID: {
              addChecks: false,
              archiveCards: false,
            },
          },
        },
      },
      trelloApi: {
        fetchBoardsAndLists: generateTrelloMember({
          boards: [
            generateTrelloBoard({
              lists: [generateTrelloList({ idBoard: 'BOARD_ID', id: 'LIST_ID' })],
            }),
          ],
        }),
      },
    });

    await simulate.waitForSelectTaskView();

    expect(cache.get().preferences).toStrictEqual({
      addChecks: false,
      keepLogs: true,
      trackStats: false,
      archiveCards: false,
    });
  });
});
