import { vi } from 'vitest';
import markCheckItemComplete from '../api/markCheckItemComplete';
import moveCardToList from '../api/moveCardToList';
import generateTrelloBoard from '../__fixtures__/generateTrelloBoard';
import generateTrelloCard from '../__fixtures__/generateTrelloCard';
import generateTrelloCheckItem from '../__fixtures__/generateTrelloCheckItem';
import generateTrelloChecklist from '../__fixtures__/generateTrelloChecklist';
import generateTrelloList from '../__fixtures__/generateTrelloList';
import generateTrelloMember from '../__fixtures__/generateTrelloMember';
import mountTrelloService from '../__fixtures__/mountTrelloService';

describe('Trello service - Task timer end', () => {
  beforeEach(() => {
    vi.mock('../api/markCheckItemComplete');
    vi.mock('../api/moveCardToList');

    vi.useFakeTimers({
      shouldAdvanceTime: true,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();

    vi.useRealTimers();
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
});
