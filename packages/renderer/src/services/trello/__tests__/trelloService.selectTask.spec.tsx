import generatePomelloUser from '@/app/__fixtures__/generatePomelloUser';
import generateTrelloBoard from '../__fixtures__/generateTrelloBoard';
import generateTrelloCard from '../__fixtures__/generateTrelloCard';
import generateTrelloCheckItem from '../__fixtures__/generateTrelloCheckItem';
import generateTrelloChecklist from '../__fixtures__/generateTrelloChecklist';
import generateTrelloList from '../__fixtures__/generateTrelloList';
import generateTrelloMember from '../__fixtures__/generateTrelloMember';
import mountTrelloService, { screen, waitFor } from '../__fixtures__/mountTrelloService';

describe('Trello service - Select task', () => {
  it('should show the board and list in the heading', async () => {
    const { simulate } = await mountTrelloService({
      config: {
        currentList: 'TASKS_ID',
      },
      trelloApi: {
        fetchBoardsAndLists: generateTrelloMember({
          boards: [
            generateTrelloBoard({
              name: 'World Domination',
              lists: [generateTrelloList({ id: 'TASKS_ID', name: 'Tasks' })],
            }),
          ],
        }),
      },
    });

    await simulate.waitForSelectTaskView();

    expect(screen.getByRole('heading', { name: 'World Domination: Tasks' })).toBeInTheDocument();
  });

  it('should fetch the cards in the correct order', async () => {
    const { appApi, simulate } = await mountTrelloService({
      trelloApi: {
        fetchCardsByListId: [
          generateTrelloCard({ checklists: [], id: '3', name: 'Third', pos: 3 }),
          generateTrelloCard({ checklists: [], id: '2', name: 'Second', pos: 2 }),
          generateTrelloCard({ checklists: [], id: '1', name: 'First', pos: 1 }),
        ],
      },
    });

    await simulate.waitForSelectTaskView();

    await waitFor(() => {
      expect(appApi.setSelectItems).toHaveBeenCalledWith(
        expect.objectContaining({
          items: [
            { id: '1', label: 'First' },
            { id: '2', label: 'Second' },
            { id: '3', label: 'Third' },
            { id: 'switch-lists', label: 'Switch to a different list', type: 'customOption' },
          ],
        })
      );
    });
  });

  it('should fetch incomplete checklists in the correct order', async () => {
    const { appApi, simulate } = await mountTrelloService({
      trelloApi: {
        fetchCardsByListId: [
          generateTrelloCard({
            checklists: [
              generateTrelloChecklist({
                checkItems: [
                  generateTrelloCheckItem({
                    id: 'milk',
                    name: 'Milk',
                    pos: 3,
                    state: 'incomplete',
                  }),
                  generateTrelloCheckItem({
                    id: 'eggs',
                    name: 'Eggs',
                    pos: 1,
                    state: 'incomplete',
                  }),
                  generateTrelloCheckItem({
                    id: 'bread',
                    name: 'Bread',
                    pos: 2,
                    state: 'incomplete',
                  }),
                ],
                id: 'buyGroceries',
                name: 'Buy groceries',
                pos: 2,
              }),
              generateTrelloChecklist({
                checkItems: [
                  generateTrelloCheckItem({
                    id: 'openAccount',
                    name: 'Open account',
                    state: 'complete',
                  }),
                  generateTrelloCheckItem({
                    id: 'depositCheck',
                    name: 'Deposit check',
                    state: 'incomplete',
                  }),
                ],
                id: 'goToBank',
                name: 'Go to bank',
                pos: 1,
              }),
            ],
            id: 'today',
            name: 'Today',
            pos: 2,
          }),
          generateTrelloCard({
            checklists: [
              generateTrelloChecklist({
                checkItems: [
                  generateTrelloCheckItem({
                    id: 'bellyButton',
                    name: 'Clean belly button lint',
                    state: 'complete',
                  }),
                  generateTrelloCheckItem({
                    id: 'scratchEar',
                    name: 'Scratch ears',
                    state: 'complete',
                  }),
                ],
                id: 'rightNow',
                name: 'Right now',
              }),
            ],
            id: 'important',
            name: 'Important',
            pos: 1,
          }),
        ],
      },
    });

    await simulate.waitForSelectTaskView();

    await waitFor(() => {
      expect(appApi.setSelectItems).toHaveBeenCalledWith(
        expect.objectContaining({
          items: [
            { id: 'important', label: 'Important' },
            { id: 'today', label: 'Today' },
            {
              id: 'goToBank',
              label: 'Go to bank',
              type: 'group',
              items: [{ id: 'depositCheck', label: 'Deposit check' }],
            },
            {
              id: 'buyGroceries',
              label: 'Buy groceries',
              type: 'group',
              items: [
                { id: 'eggs', label: 'Eggs' },
                { id: 'bread', label: 'Bread' },
                { id: 'milk', label: 'Milk' },
              ],
            },
            { id: 'switch-lists', label: 'Switch to a different list', type: 'customOption' },
          ],
        })
      );
    });
  });

  it('should not show checklists if they are not a premium user', async () => {
    const { appApi, simulate } = await mountTrelloService({
      pomelloApi: {
        fetchUser: generatePomelloUser({
          type: 'free',
        }),
      },
      trelloApi: {
        fetchCardsByListId: [
          generateTrelloCard({
            checklists: [
              generateTrelloChecklist({
                checkItems: [
                  generateTrelloCheckItem({
                    id: 'milk',
                    name: 'Milk',
                    state: 'incomplete',
                  }),
                ],
                id: 'buyGroceries',
                name: 'Buy groceries',
              }),
            ],
            id: 'today',
            name: 'Today',
          }),
          generateTrelloCard({
            id: 'tomorrow',
            name: 'Tomorrow',
            checklists: [],
          }),
        ],
      },
    });

    await simulate.waitForSelectTaskView();

    await waitFor(() => {
      expect(appApi.setSelectItems).toHaveBeenCalledWith(
        expect.objectContaining({
          items: [
            {
              id: 'today',
              label: 'Today',
            },
            {
              id: 'tomorrow',
              label: 'Tomorrow',
            },
            { id: 'switch-lists', label: 'Switch to a different list', type: 'customOption' },
          ],
        })
      );
    });
  });

  it('should not show pomodoro markers in the options', async () => {
    const { appApi, simulate } = await mountTrelloService({
      trelloApi: {
        fetchCardsByListId: [
          generateTrelloCard({
            checklists: [
              generateTrelloChecklist({
                checkItems: [
                  generateTrelloCheckItem({
                    id: 'do-specific-stuff',
                    name: '2.125 🍅 Do specific stuff',
                  }),
                ],
                id: 'tasks',
                name: 'Tasks',
              }),
            ],
            id: 'do-stuff',
            name: '6 🍅 Do stuff',
          }),
        ],
      },
    });

    await simulate.waitForSelectTaskView();

    await waitFor(() => {
      expect(appApi.setSelectItems).toHaveBeenCalledWith(
        expect.objectContaining({
          items: [
            { id: 'do-stuff', label: 'Do stuff' },
            {
              id: 'tasks',
              label: 'Tasks',
              type: 'group',
              items: [{ id: 'do-specific-stuff', label: 'Do specific stuff' }],
            },
            { id: 'switch-lists', label: 'Switch to a different list', type: 'customOption' },
          ],
        })
      );
    });
  });

  it('should be able to return to the select list view', async () => {
    const { appApi, simulate } = await mountTrelloService({
      config: {
        currentList: 'ONE',
      },
      trelloApi: {
        fetchBoardsAndLists: generateTrelloMember({
          boards: [
            generateTrelloBoard({
              name: 'My tasks',
              lists: [
                generateTrelloList({ id: 'ONE', name: 'First' }),
                generateTrelloList({ id: 'TWO', name: 'Second' }),
              ],
            }),
          ],
        }),
      },
    });

    await simulate.selectTask('switch-lists');

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Pick a list' })).toBeInTheDocument();
      expect(appApi.setSelectItems).toHaveBeenLastCalledWith(
        expect.objectContaining({
          items: [
            { id: 'previous-list', label: 'Back to "My tasks: First"', type: 'customOption' },
            { id: 'TWO', label: 'My tasks: Second' },
          ],
        })
      );
    });
  });

  it('should be able to return to their original list', async () => {
    const { simulate } = await mountTrelloService();

    await simulate.selectTask('switch-lists');
    await screen.findByRole('button', { name: 'Pick a list' });
    await simulate.selectOption('previous-list');

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Pick a task' })).toBeInTheDocument();
    });
  });
});
