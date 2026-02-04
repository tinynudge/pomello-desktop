import { generateTrelloCard } from '../__fixtures__/generateTrelloCard';
import { generateTrelloCheckItem } from '../__fixtures__/generateTrelloCheckItem';
import { generateTrelloChecklist } from '../__fixtures__/generateTrelloChecklist';
import { renderTrelloService } from '../__fixtures__/renderTrelloService';

describe('Trello service - Tracking events', () => {
  it('should not log the tracking event if disabled', async () => {
    const { pomelloApi, simulate } = await renderTrelloService({
      config: {
        preferences: {
          global: {
            trackStats: false,
          },
        },
      },
      settings: {
        taskTime: 5,
      },
    });

    await simulate.selectTask();
    await simulate.startTimer();
    await simulate.advanceTimer(5);

    expect(pomelloApi.logEvent).not.toHaveBeenCalled();
  });

  it('should add the card data to tracking event', async () => {
    const { pomelloApi, simulate } = await renderTrelloService({
      settings: {
        taskTime: 5,
      },
      trelloApi: {
        fetchCardsByListId: [generateTrelloCard({ id: 'BILLIONAIRE', name: 'Become a billionaire' })],
      },
    });

    await simulate.selectTask('BILLIONAIRE');
    await simulate.startTimer();
    await simulate.advanceTimer(5);

    expect(pomelloApi.logEvent).toHaveBeenCalledWith({
      allotted_time: 5,
      duration: 5,
      service_id: 'BILLIONAIRE',
      start_time: expect.any(Number),
      type: 'task',
    });
  });

  it('should add the checklist data to tracking event', async () => {
    const { pomelloApi, simulate } = await renderTrelloService({
      settings: {
        taskTime: 5,
      },
      trelloApi: {
        fetchCardsByListId: [
          generateTrelloCard({
            id: 'BILLIONAIRE',
            name: 'Become a billionaire',
            checklists: [
              generateTrelloChecklist({
                checkItems: [
                  generateTrelloCheckItem({
                    id: 'BEFRIEND_MARK_CUBAN',
                    name: 'Befriend Mark Cuban',
                  }),
                ],
              }),
            ],
          }),
        ],
      },
    });

    await simulate.selectTask('BEFRIEND_MARK_CUBAN');
    await simulate.startTimer();
    await simulate.advanceTimer(5);

    expect(pomelloApi.logEvent).toHaveBeenCalledWith({
      allotted_time: 5,
      duration: 5,
      parent_service_id: 'BILLIONAIRE',
      service_id: 'BEFRIEND_MARK_CUBAN',
      start_time: expect.any(Number),
      type: 'task',
    });
  });
});
