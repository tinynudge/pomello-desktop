import { vi } from 'vitest';
import markCheckItemComplete from '../api/markCheckItemComplete';
import moveCardToList from '../api/moveCardToList';
import generateTrelloBoard from '../__fixtures__/generateTrelloBoard';
import generateTrelloCard from '../__fixtures__/generateTrelloCard';
import generateTrelloCheckItem from '../__fixtures__/generateTrelloCheckItem';
import generateTrelloChecklist from '../__fixtures__/generateTrelloChecklist';
import generateTrelloList from '../__fixtures__/generateTrelloList';
import generateTrelloMember from '../__fixtures__/generateTrelloMember';
import mountTrelloService, { screen, waitFor } from '../__fixtures__/mountTrelloService';

describe('Trello service - Complete task', () => {
  beforeEach(() => {
    vi.mock('../api/markCheckItemComplete');
    vi.mock('../api/moveCardToList');
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should show Trello lists for cards', async () => {
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
    await simulate.hotkey('completeTaskEarly');

    expect(appApi.setSelectItems).toHaveBeenLastCalledWith(
      expect.objectContaining({
        items: [
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

  it('should not show the complete task view for check items', async () => {
    const { simulate } = await mountTrelloService({
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
    await simulate.hotkey('completeTaskEarly');
    await simulate.selectOption('DONE');

    expect(mockMoveCardToList).toHaveBeenCalled();
  });

  it('should archive the card upon moving the card in Trello if enabled', async () => {
    const mockMoveCardToList = vi.mocked(moveCardToList);

    const { simulate } = await mountTrelloService({
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
    await simulate.hotkey('completeTaskEarly');

    const mockedMarkCheckItemComplete = vi.mocked(markCheckItemComplete);
    expect(mockedMarkCheckItemComplete).toHaveBeenCalled();
  });
});
