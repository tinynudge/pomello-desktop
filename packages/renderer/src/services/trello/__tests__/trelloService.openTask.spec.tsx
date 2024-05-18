import { generateTrelloCard } from '../__fixtures__/generateTrelloCard';
import { generateTrelloCheckItem } from '../__fixtures__/generateTrelloCheckItem';
import { generateTrelloChecklist } from '../__fixtures__/generateTrelloChecklist';
import { renderTrelloService } from '../__fixtures__/renderTrelloService';

describe('Trello service - Open Task', () => {
  it('should open a card in Trello', async () => {
    const { appApi, simulate } = await renderTrelloService({
      trelloApi: {
        fetchCardsByListId: [
          generateTrelloCard({
            id: 'MY_CARD_ID',
          }),
        ],
      },
    });

    await simulate.selectTask('MY_CARD_ID');
    await simulate.hotkey('openInBrowser');

    expect(appApi.openUrl).toHaveBeenCalledWith('https://trello.com/c/MY_CARD_ID');
  });

  it('should open a check item in Trello', async () => {
    const { appApi, simulate } = await renderTrelloService({
      trelloApi: {
        fetchCardsByListId: [
          generateTrelloCard({
            id: 'MY_CARD_ID',
            checklists: [
              generateTrelloChecklist({
                checkItems: [
                  generateTrelloCheckItem({
                    id: 'MY_CHECK_ITEM_ID',
                    idCard: 'MY_CARD_ID',
                  }),
                ],
              }),
            ],
          }),
        ],
      },
    });

    await simulate.selectTask('MY_CHECK_ITEM_ID');
    await simulate.hotkey('openInBrowser');

    expect(appApi.openUrl).toHaveBeenCalledWith('https://trello.com/c/MY_CARD_ID');
  });
});
