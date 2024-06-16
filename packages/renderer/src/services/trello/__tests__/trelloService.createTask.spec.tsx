import { vi } from 'vitest';
import { generateTrelloBoard } from '../__fixtures__/generateTrelloBoard';
import { generateTrelloLabel } from '../__fixtures__/generateTrelloLabel';
import { generateTrelloList } from '../__fixtures__/generateTrelloList';
import { generateTrelloMember } from '../__fixtures__/generateTrelloMember';
import { renderTrelloService, screen, waitFor } from '../__fixtures__/renderTrelloService';
import { createCard } from '../api/createCard';
import { fetchCardsByListId } from '../api/fetchCardsByListId';

describe('Trello service - Create task', () => {
  const NotificationMock = vi.fn();
  vi.stubGlobal('Notification', NotificationMock);

  beforeEach(() => {
    vi.mock('../api/createCard', () => ({
      createCard: vi.fn(async () => {}),
    }));

    vi.mock('../api/fetchCardsByListId', async importOriginal => {
      const module = await importOriginal<{ fetchCardsByListId: typeof fetchCardsByListId }>();

      return {
        fetchCardsByListId: vi.fn(module.fetchCardsByListId),
      };
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should require a title to create a task', async () => {
    const { simulate, userEvent } = await renderTrelloService();

    await simulate.waitForSelectTaskView();
    await simulate.hotkey('createTask');
    await userEvent.type(screen.getByRole('textbox'), '-desc Hi there{Enter}');

    expect(NotificationMock).toHaveBeenCalledWith('A title is required', { body: undefined });
  });

  it('should notify the user when a task is created', async () => {
    const { simulate, userEvent } = await renderTrelloService();

    await simulate.waitForSelectTaskView();
    await simulate.hotkey('createTask');
    await userEvent.type(screen.getByRole('textbox'), 'Buy groceries{Enter}');

    expect(NotificationMock).toHaveBeenCalledWith('Success!', { body: 'Task created' });
  });

  it('should create a task in the current list', async () => {
    const { simulate, userEvent } = await renderTrelloService({
      config: {
        createdTaskPosition: 'bottom',
        currentList: 'MY_CURRENT_LIST',
      },
      trelloApi: {
        fetchBoardsAndLists: generateTrelloMember({
          boards: [
            generateTrelloBoard({
              lists: [generateTrelloList({ id: 'MY_CURRENT_LIST' })],
            }),
          ],
        }),
      },
    });

    await simulate.waitForSelectTaskView();
    await simulate.hotkey('createTask');
    await userEvent.type(
      screen.getByRole('textbox'),
      'World domination -desc Take over the world{Enter}'
    );

    await waitFor(() => {
      expect(createCard).toHaveBeenCalledWith({
        description: 'Take over the world',
        labelIds: [],
        listId: 'MY_CURRENT_LIST',
        position: 'bottom',
        title: 'World domination',
      });
    });

    expect(fetchCardsByListId).toHaveBeenCalledTimes(2);
  });

  it('should create a task in another list on the same board', async () => {
    const { simulate, userEvent } = await renderTrelloService({
      config: {
        currentList: 'MY_CURRENT_LIST',
      },
      trelloApi: {
        fetchBoardsAndLists: generateTrelloMember({
          boards: [
            generateTrelloBoard({
              id: 'BOARD_ONE',
              lists: [
                generateTrelloList({ id: 'MY_CURRENT_LIST', idBoard: 'BOARD_ONE' }),
                generateTrelloList({ id: 'PICK_ME', idBoard: 'BOARD_ONE', name: 'Pick me!' }),
              ],
            }),
          ],
        }),
      },
    });

    await simulate.waitForSelectTaskView();
    await simulate.hotkey('createTask');
    await userEvent.type(screen.getByRole('textbox'), 'Buy groceries -list pckme{Enter}');

    expect(createCard).toHaveBeenCalledWith({
      labelIds: [],
      listId: 'PICK_ME',
      position: 'top',
      title: 'Buy groceries',
    });

    expect(fetchCardsByListId).toHaveBeenCalledTimes(1);
  });

  it('should create a task in another list on the same board', async () => {
    const { simulate, userEvent } = await renderTrelloService({
      config: {
        currentList: 'MY_CURRENT_LIST',
      },
      trelloApi: {
        fetchBoardsAndLists: generateTrelloMember({
          boards: [
            generateTrelloBoard({
              id: 'BOARD_ONE',
              lists: [generateTrelloList({ id: 'MY_CURRENT_LIST', idBoard: 'BOARD_ONE' })],
            }),
            generateTrelloBoard({
              id: 'BOARD_TWO',
              name: 'My second board',
              lists: [
                generateTrelloList({
                  id: 'A_WHOLE_NEW_LIST',
                  idBoard: 'BOARD_TWO',
                  name: 'A whole new list',
                }),
              ],
            }),
          ],
        }),
      },
    });

    await simulate.waitForSelectTaskView();
    await simulate.hotkey('createTask');
    await userEvent.type(
      screen.getByRole('textbox'),
      '-t Show Princess Jasmine something -l scnd/a whlenewlist{Enter}'
    );

    expect(createCard).toHaveBeenCalledWith({
      labelIds: [],
      listId: 'A_WHOLE_NEW_LIST',
      position: 'top',
      title: 'Show Princess Jasmine something',
    });
  });

  it('should notify the user if unable to find the board when creating a task', async () => {
    const { simulate, userEvent } = await renderTrelloService({
      config: {
        currentList: 'MY_CURRENT_LIST',
      },
      trelloApi: {
        fetchBoardsAndLists: generateTrelloMember({
          boards: [
            generateTrelloBoard({
              id: 'BOARD_ONE',
              lists: [generateTrelloList({ id: 'MY_CURRENT_LIST', idBoard: 'BOARD_ONE' })],
            }),
            generateTrelloBoard({
              id: 'BOARD_TWO',
              name: 'My second board',
              lists: [
                generateTrelloList({
                  id: 'A_WHOLE_NEW_LIST',
                  idBoard: 'BOARD_TWO',
                  name: 'A whole new list',
                }),
              ],
            }),
          ],
        }),
      },
    });

    const input = '-t Show Princess Jasmine something -l unknown board/a whlenewlist';

    await simulate.waitForSelectTaskView();
    await simulate.hotkey('createTask');
    await userEvent.type(screen.getByRole('textbox'), `${input}{Enter}`);

    expect(NotificationMock).toHaveBeenCalledWith('Could find any boards matching "unknown board"');
    expect(createCard).not.toHaveBeenCalled();
    expect(screen.getByRole('textbox')).toHaveValue(input);
  });

  it('should notify the user if there are too many boards found when creating a task', async () => {
    const { simulate, userEvent } = await renderTrelloService({
      config: {
        currentList: 'MY_CURRENT_LIST',
      },
      trelloApi: {
        fetchBoardsAndLists: generateTrelloMember({
          boards: [
            generateTrelloBoard({
              id: 'BOARD_ONE',
              name: 'My first board',
              lists: [generateTrelloList({ id: 'MY_CURRENT_LIST', idBoard: 'BOARD_ONE' })],
            }),
            generateTrelloBoard({
              id: 'BOARD_TWO',
              name: 'My second board',
              lists: [
                generateTrelloList({
                  id: 'A_WHOLE_NEW_LIST',
                  idBoard: 'BOARD_TWO',
                  name: 'A whole new list',
                }),
              ],
            }),
          ],
        }),
      },
    });

    const input = '-t Show Princess Jasmine something -l board/a whlenewlist';

    await simulate.waitForSelectTaskView();
    await simulate.hotkey('createTask');
    await userEvent.type(screen.getByRole('textbox'), `${input}{Enter}`);

    expect(NotificationMock).toHaveBeenCalledWith(
      'Multiple boards found matching "board". Please refine your query.'
    );
    expect(createCard).not.toHaveBeenCalled();
    expect(screen.getByRole('textbox')).toHaveValue(input);
  });

  it('should notify the user if unable to find the list when creating a task', async () => {
    const { simulate, userEvent } = await renderTrelloService({
      trelloApi: {
        fetchBoardsAndLists: generateTrelloMember({
          boards: [
            generateTrelloBoard({
              lists: [generateTrelloList({ name: 'Somewhere' })],
            }),
          ],
        }),
      },
    });

    const input = 'Do laundry -l nowhere';

    await simulate.waitForSelectTaskView();
    await simulate.hotkey('createTask');
    await userEvent.type(screen.getByRole('textbox'), `${input}{Enter}`);

    expect(NotificationMock).toHaveBeenCalledWith('Could find any lists matching "nowhere"');
    expect(createCard).not.toHaveBeenCalled();
    expect(screen.getByRole('textbox')).toHaveValue(input);
  });

  it('should notify the user if there are too many lists found when creating a task', async () => {
    const { simulate, userEvent } = await renderTrelloService({
      config: {
        currentList: 'MY_LIST_ONE',
      },
      trelloApi: {
        fetchBoardsAndLists: generateTrelloMember({
          boards: [
            generateTrelloBoard({
              lists: [
                generateTrelloList({ id: 'MY_LIST_ONE', name: 'My first list' }),
                generateTrelloList({ id: 'MY_LIST_TWO', name: 'My second list' }),
              ],
            }),
          ],
        }),
      },
    });

    const input = 'Do laundry -l mylist';

    await simulate.waitForSelectTaskView();
    await simulate.hotkey('createTask');
    await userEvent.type(screen.getByRole('textbox'), `${input}{Enter}`);

    expect(NotificationMock).toHaveBeenCalledWith(
      'Multiple lists found matching "mylist". Please refine your query.'
    );
    expect(createCard).not.toHaveBeenCalled();
    expect(screen.getByRole('textbox')).toHaveValue(input);
  });

  it('should create a task with labels', async () => {
    const { simulate, userEvent } = await renderTrelloService({
      config: {
        currentList: 'MY_LIST',
      },
      trelloApi: {
        fetchBoardsAndLists: generateTrelloMember({
          boards: [
            generateTrelloBoard({
              lists: [generateTrelloList({ id: 'MY_LIST' })],
            }),
          ],
        }),
        fetchLabelsByBoardId: [
          generateTrelloLabel({ id: 'RED_LABEL', color: 'red', name: 'Action' }),
          generateTrelloLabel({ id: 'URGENT_LABEL', color: 'purple', name: 'Urgent' }),
        ],
      },
    });

    await simulate.waitForSelectTaskView();
    await simulate.hotkey('createTask');
    await userEvent.type(screen.getByRole('textbox'), 'Do laundry -# red, urgent{Enter}');

    await waitFor(() => {
      expect(createCard).toHaveBeenCalledWith({
        labelIds: ['RED_LABEL', 'URGENT_LABEL'],
        listId: 'MY_LIST',
        position: 'top',
        title: 'Do laundry',
      });
    });
  });

  it('should inform the user if certain labels were not used', async () => {
    const { simulate, userEvent } = await renderTrelloService({
      config: {
        currentList: 'MY_LIST',
      },
      trelloApi: {
        fetchBoardsAndLists: generateTrelloMember({
          boards: [
            generateTrelloBoard({
              lists: [generateTrelloList({ id: 'MY_LIST' })],
            }),
          ],
        }),
        fetchLabelsByBoardId: [
          generateTrelloLabel({ id: 'PURPLE_LABEL', color: 'purple', name: 'Action' }),
        ],
      },
    });

    await simulate.waitForSelectTaskView();
    await simulate.hotkey('createTask');
    await userEvent.type(screen.getByRole('textbox'), 'Do laundry -# purple, urgent, taupe{Enter}');

    await waitFor(() => {
      expect(NotificationMock).toHaveBeenCalledWith('Success!', {
        body: 'Task created. Ignored labels: urgent, taupe. See help for details.',
      });

      expect(createCard).toHaveBeenCalledWith({
        labelIds: ['PURPLE_LABEL'],
        listId: 'MY_LIST',
        position: 'top',
        title: 'Do laundry',
      });
    });
  });
});
