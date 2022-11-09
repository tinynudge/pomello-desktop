import { vi } from 'vitest';
import markCheckItemComplete from '../api/markCheckItemComplete';
import moveCardToList from '../api/moveCardToList';
import updateCard from '../api/updateCard';
import updateCheckItem from '../api/updateCheckItem';
import generateTrelloBoard from '../__fixtures__/generateTrelloBoard';
import generateTrelloCard from '../__fixtures__/generateTrelloCard';
import generateTrelloCheckItem from '../__fixtures__/generateTrelloCheckItem';
import generateTrelloChecklist from '../__fixtures__/generateTrelloChecklist';
import generateTrelloList from '../__fixtures__/generateTrelloList';
import generateTrelloMember from '../__fixtures__/generateTrelloMember';
import mountTrelloService from '../__fixtures__/mountTrelloService';

vi.mock('../api/markCheckItemComplete');
vi.mock('../api/moveCardToList');
vi.mock('../api/updateCard');
vi.mock('../api/updateComment');
vi.mock('../api/updateCheckItem');

describe('Trello service - Task timer end', () => {
  beforeEach(() => {
    vi.useFakeTimers({
      shouldAdvanceTime: true,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.useRealTimers();
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  it('should show Trello lists for cards in the task timer end options', async () => {
    const { appApi, simulate } = await mountTrelloService({
      config: {
        currentList: 'PHASE_ONE',
        preferences: {
          lists: {
            PHASE_ONE: {
              doneList: 'DONE',
            },
          },
        },
      },
      settings: {
        taskTime: 5,
      },
      trelloApi: {
        fetchBoardsAndLists: generateTrelloMember({
          boards: [
            generateTrelloBoard({
              name: 'World Domination',
              lists: [
                generateTrelloList({ id: 'PHASE_ONE', name: 'Phase one' }),
                generateTrelloList({ id: 'PHASE_TWO', name: 'Phase two' }),
                generateTrelloList({ id: 'PHASE_THREE', name: 'Phase three' }),
                generateTrelloList({ id: 'DONE', name: 'Done' }),
              ],
            }),
          ],
        }),
        fetchCardsByListId: [
          generateTrelloCard({ id: 'BILLIONAIRE', name: 'Become a billionaire' }),
        ],
      },
    });

    await simulate.selectTask('BILLIONAIRE');
    await simulate.startTimer();
    await simulate.advanceTimer(5);

    expect(appApi.setSelectItems).toHaveBeenLastCalledWith(
      expect.objectContaining({
        items: [
          {
            hint: 'Continue task label',
            id: 'continueTask',
            label: 'Continue after break',
          },
          {
            id: 'switchTask',
            label: 'Switch tasks after break',
          },
          {
            hint: 'Void task label',
            id: 'voidTask',
            label: 'Void this pomodoro',
          },
          {
            hint: 'Add note label',
            id: 'addNote',
            label: 'Add a note first',
          },
          {
            id: 'move-card',
            items: [
              { id: 'PHASE_ONE', label: 'Phase one' },
              { id: 'PHASE_TWO', label: 'Phase two' },
              { id: 'PHASE_THREE', label: 'Phase three' },
              { hint: 'Move task label', id: 'DONE', label: 'Done' },
            ],
            label: 'Move task to...',
            type: 'group',
          },
        ],
      })
    );
  });

  it('should show a complete option for checklist items in the task timer end options', async () => {
    const { appApi, simulate } = await mountTrelloService({
      settings: {
        taskTime: 5,
      },
      trelloApi: {
        fetchCardsByListId: [
          generateTrelloCard({
            checklists: [
              generateTrelloChecklist({
                checkItems: [
                  generateTrelloCheckItem({
                    id: 'BUY_GROCERIES',
                    name: 'Buy groceries',
                  }),
                ],
              }),
            ],
          }),
        ],
      },
    });

    await simulate.selectTask('BUY_GROCERIES');
    await simulate.startTimer();
    await simulate.advanceTimer(5);

    expect(appApi.setSelectItems).toHaveBeenLastCalledWith(
      expect.objectContaining({
        items: [
          {
            hint: 'Continue task label',
            id: 'continueTask',
            label: 'Continue after break',
          },
          {
            id: 'switchTask',
            label: 'Switch tasks after break',
          },
          {
            hint: 'Void task label',
            id: 'voidTask',
            label: 'Void this pomodoro',
          },
          {
            hint: 'Add note label',
            id: 'addNote',
            label: 'Add a note first',
          },
          {
            hint: 'Move task label',
            id: 'check-item-complete',
            label: 'Mark item complete',
          },
        ],
      })
    );
  });

  it('should store the selected list in the preferences', async () => {
    const { config, simulate } = await mountTrelloService({
      config: {
        currentList: 'PHASE_ONE',
        preferences: {
          lists: {
            PHASE_ONE: {
              doneList: 'PHASE_TWO',
            },
          },
        },
      },
      settings: {
        taskTime: 5,
      },
      trelloApi: {
        fetchBoardsAndLists: generateTrelloMember({
          boards: [
            generateTrelloBoard({
              lists: [
                generateTrelloList({ id: 'PHASE_ONE', name: 'Phase one' }),
                generateTrelloList({ id: 'DONE', name: 'Done' }),
              ],
            }),
          ],
        }),
        fetchCardsByListId: [generateTrelloCard({ id: 'MY_TASK' })],
      },
    });

    await simulate.selectTask('MY_TASK');
    await simulate.startTimer();
    await simulate.advanceTimer(5);
    await simulate.selectOption('DONE');

    expect(config.get().preferences?.lists).toMatchObject({
      PHASE_ONE: {
        doneList: 'DONE',
      },
    });
  });

  it('should move the card to the target list Trello', async () => {
    const mockMoveCardToList = vi.mocked(moveCardToList);

    const { simulate } = await mountTrelloService({
      config: {
        currentList: 'PHASE_ONE',
      },
      settings: {
        taskTime: 5,
      },
      trelloApi: {
        fetchBoardsAndLists: generateTrelloMember({
          boards: [
            generateTrelloBoard({
              name: 'World Domination',
              lists: [
                generateTrelloList({ id: 'PHASE_ONE', name: 'Phase one' }),
                generateTrelloList({ id: 'DONE', name: 'Done' }),
              ],
            }),
          ],
        }),
        fetchCardsByListId: [generateTrelloCard({ id: 'MY_TASK' })],
      },
    });

    await simulate.selectTask('MY_TASK');
    await simulate.startTimer();
    await simulate.advanceTimer(5);
    await simulate.selectOption('DONE');

    expect(mockMoveCardToList).toHaveBeenCalled();
  });

  it('should mark the checklist item as complete in Trello', async () => {
    const { simulate } = await mountTrelloService({
      settings: {
        taskTime: 5,
      },
      trelloApi: {
        fetchCardsByListId: [
          generateTrelloCard({
            checklists: [
              generateTrelloChecklist({
                checkItems: [
                  generateTrelloCheckItem({
                    id: 'BUY_GROCERIES',
                    name: 'Buy groceries',
                  }),
                ],
              }),
            ],
          }),
        ],
      },
    });

    await simulate.selectTask('BUY_GROCERIES');
    await simulate.startTimer();
    await simulate.advanceTimer(5);
    await simulate.selectOption('check-item-complete');

    const mockedMarkCheckItemComplete = vi.mocked(markCheckItemComplete);
    expect(mockedMarkCheckItemComplete).toHaveBeenCalled();
  });

  it('should add the pomodoro count to the card title if enabled', async () => {
    const mockUpdateCard = vi.mocked(updateCard);

    const { simulate } = await mountTrelloService({
      config: {
        preferences: {
          global: {
            addChecks: true,
          },
        },
      },
      settings: {
        taskTime: 8,
        titleFormat: 'decimal',
        titleMarker: '🍅',
      },
      trelloApi: {
        fetchCardsByListId: [generateTrelloCard({ id: 'MY_TASK', name: 'My task' })],
      },
    });

    await simulate.selectTask('MY_TASK');
    await simulate.startTimer();
    await simulate.advanceTimer(8);

    expect(mockUpdateCard).toHaveBeenCalledWith({
      id: 'MY_TASK',
      data: { name: '1 🍅 My task' },
    });
  });

  it('should update the pomodoro count by decimals in the card title if enabled', async () => {
    const mockUpdateCard = vi.mocked(updateCard);

    const { simulate } = await mountTrelloService({
      config: {
        preferences: {
          global: {
            addChecks: true,
          },
        },
      },
      settings: {
        taskTime: 8,
        titleFormat: 'decimal',
        titleMarker: '🍅',
      },
      trelloApi: {
        fetchCardsByListId: [generateTrelloCard({ id: 'MY_TASK', name: '1 🍅 My task' })],
      },
    });

    await simulate.selectTask('MY_TASK');
    await simulate.startTimer();
    await simulate.advanceTimer(3);
    await simulate.hotkey('completeTaskEarly');

    expect(mockUpdateCard).toHaveBeenCalledWith({
      id: 'MY_TASK',
      data: { name: '1.375 🍅 My task' },
    });
  });

  it('should update the pomodoro count to the nearest eighth in decimals', async () => {
    const mockUpdateCard = vi.mocked(updateCard);

    const { simulate } = await mountTrelloService({
      config: {
        preferences: {
          global: {
            addChecks: true,
          },
        },
      },
      settings: {
        taskTime: 20,
        titleFormat: 'decimal',
        titleMarker: '🍅',
      },
      trelloApi: {
        fetchCardsByListId: [generateTrelloCard({ id: 'MY_TASK', name: '1 🍅 My task' })],
      },
    });

    await simulate.selectTask('MY_TASK');
    await simulate.startTimer();
    await simulate.advanceTimer(7);
    await simulate.hotkey('completeTaskEarly');

    expect(mockUpdateCard).toHaveBeenCalledWith({
      id: 'MY_TASK',
      data: { name: '1.375 🍅 My task' },
    });
  });

  it('should update the pomodoro count by fraction in the card title if enabled', async () => {
    const mockUpdateCard = vi.mocked(updateCard);

    const { simulate } = await mountTrelloService({
      config: {
        preferences: {
          global: {
            addChecks: true,
          },
        },
      },
      settings: {
        taskTime: 8,
        titleFormat: 'fraction',
        titleMarker: '🍅',
      },
      trelloApi: {
        fetchCardsByListId: [generateTrelloCard({ id: 'MY_TASK', name: '1 🍅 My task' })],
      },
    });

    await simulate.selectTask('MY_TASK');
    await simulate.startTimer();
    await simulate.advanceTimer(7);
    await simulate.hotkey('completeTaskEarly');

    expect(mockUpdateCard).toHaveBeenCalledWith({
      id: 'MY_TASK',
      data: { name: '1⅞ 🍅 My task' },
    });
  });

  it('should update the pomodoro count to the nearest eighth in fractions', async () => {
    const mockUpdateCard = vi.mocked(updateCard);

    const { simulate } = await mountTrelloService({
      config: {
        preferences: {
          global: {
            addChecks: true,
          },
        },
      },
      settings: {
        taskTime: 16,
        titleFormat: 'fraction',
        titleMarker: '🍅',
      },
      trelloApi: {
        fetchCardsByListId: [generateTrelloCard({ id: 'MY_TASK', name: '1 🍅 My task' })],
      },
    });

    await simulate.selectTask('MY_TASK');
    await simulate.startTimer();
    await simulate.advanceTimer(9);
    await simulate.hotkey('completeTaskEarly');

    expect(mockUpdateCard).toHaveBeenCalledWith({
      id: 'MY_TASK',
      data: { name: '1½ 🍅 My task' },
    });
  });

  it('should not update the card title with the pomodoro count if disabled', async () => {
    const mockUpdateCard = vi.mocked(updateCard);

    const { simulate } = await mountTrelloService({
      config: {
        preferences: {
          global: {
            addChecks: false,
          },
        },
      },
      settings: {
        taskTime: 8,
      },
      trelloApi: {
        fetchCardsByListId: [generateTrelloCard({ id: 'MY_TASK', name: 'My task' })],
      },
    });

    await simulate.selectTask('MY_TASK');
    await simulate.startTimer();
    await simulate.advanceTimer(8);

    expect(mockUpdateCard).not.toHaveBeenCalled();
  });

  it('should update the card title and check item with the pomodoro count if enabled', async () => {
    const mockUpdateCard = vi.mocked(updateCard);
    const mockUpdateCheckItem = vi.mocked(updateCheckItem);

    const { simulate } = await mountTrelloService({
      config: {
        preferences: {
          global: {
            addChecks: true,
          },
        },
      },
      settings: {
        taskTime: 8,
        titleFormat: 'decimal',
        titleMarker: '🍅',
      },
      trelloApi: {
        fetchCardsByListId: [
          generateTrelloCard({
            checklists: [
              generateTrelloChecklist({
                checkItems: [
                  generateTrelloCheckItem({
                    id: 'MY_CHECK_ITEM',
                    name: 'My mini-task',
                  }),
                ],
              }),
            ],
            id: 'MY_TASK',
            name: '1 🍅 My task',
          }),
        ],
      },
    });

    await simulate.selectTask('MY_CHECK_ITEM');
    await simulate.startTimer();
    await simulate.advanceTimer(7);
    await simulate.hotkey('completeTaskEarly');

    expect(mockUpdateCard).toHaveBeenCalledWith({
      id: 'MY_TASK',
      data: { name: '1.875 🍅 My task' },
    });

    expect(mockUpdateCheckItem).toHaveBeenCalledWith({
      id: 'MY_CHECK_ITEM',
      cardId: 'MY_TASK',
      data: { name: '0.875 🍅 My mini-task' },
    });
  });
});
