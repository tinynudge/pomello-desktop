import { HttpResponse } from 'msw';
import { vi } from 'vitest';
import { generateTrelloBoard } from '../__fixtures__/generateTrelloBoard';
import { generateTrelloCard } from '../__fixtures__/generateTrelloCard';
import { generateTrelloCheckItem } from '../__fixtures__/generateTrelloCheckItem';
import { generateTrelloChecklist } from '../__fixtures__/generateTrelloChecklist';
import { generateTrelloList } from '../__fixtures__/generateTrelloList';
import { generateTrelloMember } from '../__fixtures__/generateTrelloMember';
import { renderTrelloService, screen, waitFor } from '../__fixtures__/renderTrelloService';
import { markCardComplete } from '../api/markCardComplete';
import { markCheckItemComplete } from '../api/markCheckItemComplete';
import { moveCardToList } from '../api/moveCardToList';
import { TrelloCard, TrelloCheckItem } from '../domain';

describe('Trello service - Complete task', () => {
  beforeEach(() => {
    vi.mock('../api/markCardComplete');
    vi.mock('../api/markCheckItemComplete');
    vi.mock('../api/moveCardToList');

    vi.useFakeTimers({
      shouldAdvanceTime: true,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();

    vi.clearAllMocks();
    vi.useRealTimers();
  });

  it('should show Trello lists for cards', async () => {
    const { appApi, simulate } = await renderTrelloService({
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
        fetchCardsByListId: [generateTrelloCard({ id: 'BILLIONAIRE', name: 'Become a billionaire' })],
      },
    });

    await simulate.selectTask('BILLIONAIRE');
    await simulate.startTimer();
    await simulate.hotkey('completeTaskEarly');

    expect(appApi.setSelectItems).toHaveBeenLastCalledWith(
      expect.objectContaining({
        items: [
          {
            hint: '⌘ ⇧ B',
            id: 'mark-card-complete',
            label: 'Mark card as completed',
          },
          {
            id: 'move-card',
            items: [
              { id: 'PHASE_ONE', label: 'Phase one' },
              { id: 'PHASE_TWO', label: 'Phase two' },
              { id: 'PHASE_THREE', label: 'Phase three' },
              { hint: '⌘ ⇧ G', id: 'DONE', label: 'Done' },
            ],
            label: 'Move task to...',
            type: 'group',
          },
        ],
      })
    );
  });

  it('should not show the complete task view for check items', async () => {
    const { simulate } = await renderTrelloService({
      trelloApi: {
        fetchCardsByListId: [
          generateTrelloCard({
            checklists: [
              generateTrelloChecklist({
                checkItems: [
                  generateTrelloCheckItem({
                    id: 'FOO',
                    name: 'Foo',
                  }),
                ],
              }),
            ],
          }),
        ],
      },
    });

    await simulate.selectTask('FOO');
    await simulate.startTimer();
    await simulate.hotkey('completeTaskEarly');

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Pick a task' })).toBeInTheDocument();
    });
  });

  it('should store the selected list in the preferences', async () => {
    const { config, simulate } = await renderTrelloService({
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
    await simulate.hotkey('completeTaskEarly');
    await simulate.selectOption('DONE');

    expect(config.get().preferences?.lists).toMatchObject({
      PHASE_ONE: {
        doneList: 'DONE',
      },
    });
  });

  it('should move the card to the target list in Trello', async () => {
    const mockMoveCardToList = vi.mocked(moveCardToList);

    const { simulate } = await renderTrelloService({
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
    await simulate.hotkey('completeTaskEarly');
    await simulate.selectOption('DONE');

    expect(mockMoveCardToList).toHaveBeenCalled();
  });

  it('should archive the card upon moving the card in Trello if enabled', async () => {
    const mockMoveCardToList = vi.mocked(moveCardToList);

    const { simulate } = await renderTrelloService({
      config: {
        currentList: 'PHASE_ONE',
        preferences: {
          global: {
            archiveCards: true,
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
    await simulate.hotkey('completeTaskEarly');
    await simulate.selectOption('DONE');

    expect(mockMoveCardToList).toHaveBeenCalledWith(
      expect.objectContaining({
        closed: true,
      })
    );
  });

  it('should mark the checklist item as complete in Trello', async () => {
    const { simulate } = await renderTrelloService({
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
    await simulate.hotkey('completeTaskEarly');

    const mockedMarkCheckItemComplete = vi.mocked(markCheckItemComplete);
    expect(mockedMarkCheckItemComplete).toHaveBeenCalled();
  });

  it('should mark the card as complete in Trello', async () => {
    const { simulate } = await renderTrelloService({
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
              lists: [generateTrelloList({ id: 'PHASE_ONE', name: 'Phase one' })],
            }),
          ],
        }),
        fetchCardsByListId: [generateTrelloCard({ id: 'MY_TASK' })],
      },
    });

    await simulate.selectTask('MY_TASK');
    await simulate.startTimer();
    await simulate.hotkey('completeTaskEarly');
    await simulate.hotkey('completeTaskEarly');

    const mockedMarkCardComplete = vi.mocked(markCardComplete);
    expect(mockedMarkCardComplete).toHaveBeenCalled();
  });

  it('should optimistically remove a card when completing early and moving to another list', async () => {
    const cards = new Map([
      ['MY_FIRST_TASK', generateTrelloCard({ id: 'MY_FIRST_TASK', name: 'My first task', checklists: [] })],
      ['MY_SECOND_TASK', generateTrelloCard({ id: 'MY_SECOND_TASK', name: 'My second task', checklists: [] })],
    ]);

    const { appApi, simulate } = await renderTrelloService({
      config: {
        currentList: 'MY_FIRST_LIST_ID',
      },
      settings: {
        taskTime: 5,
        shortBreakTime: 3,
      },
      trelloApi: {
        fetchBoardsAndLists: generateTrelloMember({
          boards: [
            generateTrelloBoard({
              lists: [
                generateTrelloList({ id: 'MY_FIRST_LIST_ID', name: 'My first list' }),
                generateTrelloList({ id: 'MY_SECOND_LIST_ID', name: 'My second list' }),
              ],
            }),
          ],
        }),
        fetchCardsByListId: () => HttpResponse.json<TrelloCard[]>(Array.from(cards.values())),
        updateCard: ({ params }) => {
          const cardId = params.idCard as string;
          const card = cards.get(cardId);

          cards.delete(cardId);

          return HttpResponse.json<TrelloCard>(card);
        },
      },
    });

    await simulate.selectTask('MY_FIRST_TASK');
    await simulate.startTimer();
    await simulate.advanceTimer(3);
    await simulate.hotkey('completeTaskEarly');
    await simulate.selectOption('MY_SECOND_LIST_ID');
    await simulate.advanceTimer(2);
    await simulate.startTimer();
    await simulate.advanceTimer(3);
    await simulate.waitForSelectTaskView();

    await waitFor(() => {
      expect(appApi.setSelectItems).toHaveBeenLastCalledWith(
        expect.objectContaining({
          items: [
            {
              id: 'MY_SECOND_TASK',
              label: 'My second task',
            },
            {
              id: 'switch-lists',
              label: 'Switch to a different list',
              type: 'customOption',
            },
          ],
        })
      );
    });
  });

  it('should not optimistically remove the card when completing early and moving to the same list', async () => {
    const { appApi, simulate } = await renderTrelloService({
      config: {
        currentList: 'MY_FIRST_LIST_ID',
      },
      settings: {
        taskTime: 5,
        shortBreakTime: 3,
      },
      trelloApi: {
        fetchBoardsAndLists: generateTrelloMember({
          boards: [
            generateTrelloBoard({
              lists: [
                generateTrelloList({ id: 'MY_FIRST_LIST_ID', name: 'My first list' }),
                generateTrelloList({ id: 'MY_SECOND_LIST_ID', name: 'My second list' }),
              ],
            }),
          ],
        }),
        fetchCardsByListId: [
          generateTrelloCard({ id: 'MY_FIRST_TASK', name: 'My first task', checklists: [] }),
          generateTrelloCard({ id: 'MY_SECOND_TASK', name: 'My second task', checklists: [] }),
        ],
      },
    });

    await simulate.selectTask('MY_FIRST_TASK');
    await simulate.startTimer();
    await simulate.advanceTimer(3);
    await simulate.hotkey('completeTaskEarly');
    await simulate.selectOption('MY_FIRST_LIST_ID');
    await simulate.advanceTimer(2);
    await simulate.startTimer();
    await simulate.advanceTimer(3);
    await simulate.waitForSelectTaskView();

    expect(appApi.setSelectItems).toHaveBeenLastCalledWith(
      expect.objectContaining({
        items: [
          {
            id: 'MY_FIRST_TASK',
            label: 'My first task',
          },
          {
            id: 'MY_SECOND_TASK',
            label: 'My second task',
          },
          {
            id: 'switch-lists',
            label: 'Switch to a different list',
            type: 'customOption',
          },
        ],
      })
    );
  });

  it('should optimistically remove a checklist item when completing early', async () => {
    const checkItems = new Map([
      ['MY_FIRST_CHECK_ITEM', generateTrelloCheckItem({ id: 'MY_FIRST_CHECK_ITEM', name: 'My first check item' })],
      ['MY_SECOND_CHECK_ITEM', generateTrelloCheckItem({ id: 'MY_SECOND_CHECK_ITEM', name: 'My second check item' })],
    ]);
    const { appApi, simulate } = await renderTrelloService({
      settings: {
        taskTime: 5,
        shortBreakTime: 3,
      },
      trelloApi: {
        fetchCardsByListId: () =>
          HttpResponse.json<TrelloCard[]>([
            generateTrelloCard({
              id: 'MY_FIRST_TASK',
              name: 'My first task',
              checklists: [
                generateTrelloChecklist({
                  id: 'MY_FIRST_CHECKLIST',
                  name: 'My first checklist',
                  checkItems: Array.from(checkItems.values()),
                }),
              ],
            }),
          ]),
        markCheckItemComplete: request => {
          const checkItemId = request.params.idCheckItem as string;
          const checkItem = checkItems.get(checkItemId);

          checkItems.delete(checkItemId);

          return HttpResponse.json<TrelloCheckItem>(checkItem);
        },
      },
    });

    await simulate.selectTask('MY_FIRST_CHECK_ITEM');
    await simulate.startTimer();
    await simulate.advanceTimer(3);
    await simulate.hotkey('completeTaskEarly');
    await simulate.advanceTimer(2);
    await simulate.startTimer();
    await simulate.advanceTimer(3);
    await simulate.waitForSelectTaskView();

    await waitFor(() => {
      expect(appApi.setSelectItems).toHaveBeenLastCalledWith(
        expect.objectContaining({
          items: [
            {
              id: 'MY_FIRST_TASK',
              label: 'My first task',
            },
            {
              id: 'MY_FIRST_CHECKLIST',
              label: 'My first checklist',
              items: [{ id: 'MY_SECOND_CHECK_ITEM', label: 'My second check item' }],
              type: 'group',
            },
            {
              id: 'switch-lists',
              label: 'Switch to a different list',
              type: 'customOption',
            },
          ],
        })
      );
    });
  });

  it('should optimistically remove all child checklists when the card is completed early', async () => {
    const { appApi, simulate } = await renderTrelloService({
      config: {
        currentList: 'MY_FIRST_LIST_ID',
      },
      settings: {
        taskTime: 5,
        shortBreakTime: 3,
      },
      trelloApi: {
        fetchBoardsAndLists: generateTrelloMember({
          boards: [
            generateTrelloBoard({
              lists: [generateTrelloList({ id: 'MY_FIRST_LIST_ID' }), generateTrelloList({ id: 'MY_SECOND_LIST_ID' })],
            }),
          ],
        }),
        fetchCardsByListId: [
          generateTrelloCard({
            id: 'MY_FIRST_TASK',
            name: 'My first task',
            checklists: [
              generateTrelloChecklist({
                id: 'MY_FIRST_CHECKLIST',
                name: 'My first checklist',
                checkItems: [
                  generateTrelloCheckItem({
                    id: 'MY_FIRST_CHECK_ITEM',
                    name: 'My first check item',
                  }),
                ],
              }),
            ],
          }),
        ],
      },
    });

    await simulate.selectTask('MY_FIRST_TASK');
    await simulate.startTimer();
    await simulate.advanceTimer(3);
    await simulate.hotkey('completeTaskEarly');
    await simulate.selectOption('MY_SECOND_LIST_ID');
    await simulate.waitForSelectTaskView();

    await waitFor(() => {
      expect(appApi.setSelectItems).toHaveBeenCalledWith(
        expect.objectContaining({
          items: [
            {
              id: 'switch-lists',
              label: 'Switch to a different list',
              type: 'customOption',
            },
          ],
        })
      );
    });
  });
});
