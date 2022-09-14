import generateTrelloCard from '../__fixtures__/generateTrelloCard';
import generateTrelloCheckItem from '../__fixtures__/generateTrelloCheckItem';
import generateTrelloChecklist from '../__fixtures__/generateTrelloChecklist';
import mountTrelloService, { waitFor } from '../__fixtures__/mountTrelloService';

describe('Trello service - Select task', () => {
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
      expect(appApi.setSelectItems).toHaveBeenCalledWith({
        items: [
          { id: '1', label: 'First' },
          { id: '2', label: 'Second' },
          { id: '3', label: 'Third' },
        ],
        placeholder: 'Pick a task',
      });
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
      expect(appApi.setSelectItems).toHaveBeenCalledWith({
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
        ],
        placeholder: 'Pick a task',
      });
    });
  });
});
