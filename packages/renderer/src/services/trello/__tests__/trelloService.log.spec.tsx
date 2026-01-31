import { vi } from 'vitest';
import { generateTrelloBoard } from '../__fixtures__/generateTrelloBoard';
import { generateTrelloCard } from '../__fixtures__/generateTrelloCard';
import { generateTrelloCardAction } from '../__fixtures__/generateTrelloCardAction';
import { generateTrelloCheckItem } from '../__fixtures__/generateTrelloCheckItem';
import { generateTrelloChecklist } from '../__fixtures__/generateTrelloChecklist';
import { generateTrelloList } from '../__fixtures__/generateTrelloList';
import { generateTrelloMember } from '../__fixtures__/generateTrelloMember';
import { waitFor, renderTrelloService } from '../__fixtures__/renderTrelloService';
import { addComment } from '../api/addComment';
import { updateComment } from '../api/updateComment';

vi.mock('../api/addComment', () => ({ addComment: vi.fn() }));
vi.mock('../api/updateComment', () => ({ updateComment: vi.fn() }));

const mockAddComment = vi.mocked(addComment).mockResolvedValue(generateTrelloCardAction());
const mockUpdateComment = vi.mocked(updateComment);

describe('Trello service - Log', () => {
  beforeEach(() => {
    vi.useFakeTimers({
      shouldAdvanceTime: true,
      shouldClearNativeTimers: true,
    });

    const date = new Date(2022, 9, 10, 13, 2, 23);
    vi.setSystemTime(date);
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.useRealTimers();
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  it("should add a task started entry when a card's task timer starts", async () => {
    const { simulate } = await renderTrelloService({
      config: {
        preferences: {
          global: {
            addChecks: false,
            keepLogs: true,
          },
        },
      },
      trelloApi: {
        fetchCardsByListId: [generateTrelloCard({ id: 'MY_CARD_ID' })],
      },
    });

    await simulate.selectTask('MY_CARD_ID');
    await simulate.startTimer();

    expect(mockAddComment).toHaveBeenCalledWith(
      'MY_CARD_ID',
      '**Pomello Log**\n \n---\n**Total time spent:** **\n---\nTask started - *1:02 pm on Oct 10, 2022*\n \n>*#eyJ0b3RhbCI6MH0=*\n \n*Do not delete. Please avoid editing this comment.*'
    );
  });

  it("should add a task started entry when a checklist item's task timer starts", async () => {
    const { simulate } = await renderTrelloService({
      config: {
        preferences: {
          global: {
            addChecks: false,
            keepLogs: true,
          },
        },
      },
      trelloApi: {
        fetchCardsByListId: [
          generateTrelloCard({
            id: 'MY_CARD_ID',
            checklists: [
              generateTrelloChecklist({
                checkItems: [generateTrelloCheckItem({ id: 'MY_CHECK_ITEM_ID' })],
              }),
            ],
          }),
        ],
      },
    });

    await simulate.selectTask('MY_CHECK_ITEM_ID');
    await simulate.startTimer();

    expect(mockAddComment).toHaveBeenCalledWith(
      'MY_CARD_ID',
      '**Pomello Log**\n \n---\n**Total time spent:** **\n---\nChecklist task started - *1:02 pm on Oct 10, 2022*\n \n>*#eyJ0b3RhbCI6MH0=*\n \n*Do not delete. Please avoid editing this comment.*'
    );
  });

  it('should add a task started entry when switching to a new card', async () => {
    const { simulate } = await renderTrelloService({
      config: {
        preferences: {
          global: {
            addChecks: false,
            keepLogs: true,
          },
        },
      },
      settings: {
        taskTime: 120,
      },
      trelloApi: {
        fetchCardsByListId: [
          generateTrelloCard({ id: 'MY_CARD_ID' }),
          generateTrelloCard({ id: 'MY_SECOND_CARD_ID' }),
        ],
      },
    });

    await simulate.selectTask('MY_CARD_ID');
    await simulate.startTimer();
    await simulate.advanceTimer(50);
    await simulate.hotkey('switchTask');
    await simulate.selectTask('MY_SECOND_CARD_ID');
    await simulate.advanceTimer(70);

    expect(mockAddComment).toHaveBeenNthCalledWith(
      2,
      'MY_SECOND_CARD_ID',
      '**Pomello Log**\n \n---\n**Total time spent:** **\n---\nTask started - *1:03 pm on Oct 10, 2022*\n \n>*#eyJ0b3RhbCI6MH0=*\n \n*Do not delete. Please avoid editing this comment.*'
    );

    expect(mockUpdateComment).toHaveBeenNthCalledWith(
      2,
      'TRELLO_ACTION_ID',
      '**Pomello Log**\n \n---\n**Total time spent:** 1 minute\n---\nTask stopped - *1:04 pm on Oct 10, 2022*\nTask started - *1:03 pm on Oct 10, 2022*\n \n>*#eyJ0b3RhbCI6NzB9*\n \n*Do not delete. Please avoid editing this comment.*'
    );
  });

  it('should add a task paused entry when pausing a timer', async () => {
    const { simulate } = await renderTrelloService({
      config: {
        preferences: {
          global: {
            addChecks: false,
            keepLogs: true,
          },
        },
      },
      trelloApi: {
        fetchCardsByListId: [generateTrelloCard({ id: 'MY_CARD_ID' })],
      },
    });

    await simulate.selectTask('MY_CARD_ID');
    await simulate.startTimer();
    await simulate.advanceTimer(60);
    await simulate.hotkey('pauseTimer');

    expect(mockUpdateComment).toHaveBeenCalledWith(
      'TRELLO_ACTION_ID',
      '**Pomello Log**\n \n---\n**Total time spent:** **\n---\nTask paused - *1:03 pm on Oct 10, 2022*\nTask started - *1:02 pm on Oct 10, 2022*\n \n>*#eyJ0b3RhbCI6MH0=*\n \n*Do not delete. Please avoid editing this comment.*'
    );
  });

  it('should add a task resumed entry when resuming a timer', async () => {
    const { simulate } = await renderTrelloService({
      config: {
        preferences: {
          global: {
            addChecks: false,
            keepLogs: true,
          },
        },
      },
      trelloApi: {
        fetchCardsByListId: [generateTrelloCard({ id: 'MY_CARD_ID' })],
      },
    });

    await simulate.selectTask('MY_CARD_ID');
    await simulate.startTimer();
    await simulate.advanceTimer(60);
    await simulate.hotkey('pauseTimer');
    await simulate.advanceTimer(60);
    await simulate.hotkey('startTimer');

    await waitFor(() => {
      expect(mockUpdateComment).toHaveBeenLastCalledWith(
        'TRELLO_ACTION_ID',
        '**Pomello Log**\n \n---\n**Total time spent:** **\n---\nTask resumed - *1:04 pm on Oct 10, 2022*\nTask paused - *1:03 pm on Oct 10, 2022*\nTask started - *1:02 pm on Oct 10, 2022*\n \n>*#eyJ0b3RhbCI6MH0=*\n \n*Do not delete. Please avoid editing this comment.*'
      );
    });
  });

  it("should add a task ended and update the total time when a card's task timer ends", async () => {
    const { simulate } = await renderTrelloService({
      config: {
        preferences: {
          global: {
            addChecks: false,
            keepLogs: true,
          },
        },
      },
      settings: {
        taskTime: 100,
      },
      trelloApi: {
        fetchCardsByListId: [
          generateTrelloCard({
            id: 'MY_CARD_ID',
          }),
        ],
      },
    });

    await simulate.selectTask('MY_CARD_ID');
    await simulate.startTimer();
    await simulate.advanceTimer(100);

    expect(mockUpdateComment).toHaveBeenCalledWith(
      'TRELLO_ACTION_ID',
      '**Pomello Log**\n \n---\n**Total time spent:** 2 minutes\n---\nTask stopped - *1:04 pm on Oct 10, 2022*\nTask started - *1:02 pm on Oct 10, 2022*\n \n>*#eyJ0b3RhbCI6MTAwfQ==*\n \n*Do not delete. Please avoid editing this comment.*'
    );
  });

  it('should add a task ended and update the total time when a task is switched', async () => {
    const { simulate } = await renderTrelloService({
      config: {
        preferences: {
          global: {
            addChecks: false,
            keepLogs: true,
          },
        },
      },
      settings: {
        taskTime: 100,
      },
      trelloApi: {
        fetchCardsByListId: [
          generateTrelloCard({
            id: 'MY_CARD_ID',
          }),
        ],
      },
    });

    await simulate.selectTask('MY_CARD_ID');
    await simulate.startTimer();
    await simulate.advanceTimer(60);
    await simulate.hotkey('switchTask');

    expect(mockUpdateComment).toHaveBeenCalledWith(
      'TRELLO_ACTION_ID',
      '**Pomello Log**\n \n---\n**Total time spent:** 1 minute\n---\nTask stopped - *1:03 pm on Oct 10, 2022*\nTask started - *1:02 pm on Oct 10, 2022*\n \n>*#eyJ0b3RhbCI6NjB9*\n \n*Do not delete. Please avoid editing this comment.*'
    );
  });

  it("should add a check item stopped and update the total time when a check item's task timer ends", async () => {
    const { simulate } = await renderTrelloService({
      config: {
        preferences: {
          global: {
            addChecks: false,
            keepLogs: true,
          },
        },
      },
      settings: {
        taskTime: 100,
      },
      trelloApi: {
        fetchCardsByListId: [
          generateTrelloCard({
            checklists: [
              generateTrelloChecklist({
                checkItems: [
                  generateTrelloCheckItem({
                    id: 'MY_CHECK_ITEM_ID',
                  }),
                ],
              }),
            ],
            id: 'MY_CARD_ID',
          }),
        ],
      },
    });

    await simulate.selectTask('MY_CHECK_ITEM_ID');
    await simulate.startTimer();
    await simulate.advanceTimer(100);

    expect(mockUpdateComment).toHaveBeenCalledWith(
      'TRELLO_ACTION_ID',
      '**Pomello Log**\n \n---\n**Total time spent:** 2 minutes\n---\nChecklist task stopped - *1:04 pm on Oct 10, 2022*\nChecklist task started - *1:02 pm on Oct 10, 2022*\n \n>*#eyJ0b3RhbCI6MTAwfQ==*\n \n*Do not delete. Please avoid editing this comment.*'
    );
  });

  it('should handle logs where the time spent is less than a minute', async () => {
    const { simulate } = await renderTrelloService({
      config: {
        preferences: {
          global: {
            addChecks: false,
            keepLogs: true,
          },
        },
      },
      settings: {
        taskTime: 10,
      },
      trelloApi: {
        fetchCardsByListId: [
          generateTrelloCard({
            id: 'MY_CARD_ID',
          }),
        ],
      },
    });

    await simulate.selectTask('MY_CARD_ID');
    await simulate.startTimer();
    await simulate.advanceTimer(10);

    expect(mockUpdateComment).toHaveBeenCalledWith(
      'TRELLO_ACTION_ID',
      '**Pomello Log**\n \n---\n**Total time spent:** Less than a minute\n---\nTask stopped - *1:02 pm on Oct 10, 2022*\nTask started - *1:02 pm on Oct 10, 2022*\n \n>*#eyJ0b3RhbCI6MTB9*\n \n*Do not delete. Please avoid editing this comment.*'
    );
  });

  it('should handle logs where the time spent contains exactly one minute', async () => {
    const { simulate } = await renderTrelloService({
      config: {
        preferences: {
          global: {
            addChecks: false,
            keepLogs: true,
          },
        },
      },
      settings: {
        taskTime: 60,
      },
      trelloApi: {
        fetchCardsByListId: [
          generateTrelloCard({
            actions: [
              generateTrelloCardAction({
                data: {
                  text: '**Pomello Log**\n \n---\n**Total time spent:** 1 hour\n---\nTask stopped - *10:00 pm on Oct 9, 2022*\nTask started - *9:00 pm on Oct 9, 2022*\n \n>*#eyJ0b3RhbCI6MzYwMH0=*\n \n*Do not delete. Please avoid editing this comment.*',
                },
                id: 'MY_ACTION_ID',
              }),
            ],
            id: 'MY_CARD_ID',
          }),
        ],
      },
    });

    await simulate.selectTask('MY_CARD_ID');
    await simulate.startTimer();
    await simulate.advanceTimer(60);

    expect(mockUpdateComment).toHaveBeenLastCalledWith(
      'MY_ACTION_ID',
      '**Pomello Log**\n \n---\n**Total time spent:** 1 hour and 1 minute\n---\nTask stopped - *1:03 pm on Oct 10, 2022*\nTask started - *1:02 pm on Oct 10, 2022*\nTask stopped - *10:00 pm on Oct 9, 2022*\nTask started - *9:00 pm on Oct 9, 2022*\n \n>*#eyJ0b3RhbCI6MzY2MH0=*\n \n*Do not delete. Please avoid editing this comment.*'
    );
  });

  it('should handle logs where the time spent is less than an hour', async () => {
    const { simulate } = await renderTrelloService({
      config: {
        preferences: {
          global: {
            addChecks: false,
            keepLogs: true,
          },
        },
      },
      settings: {
        taskTime: 60,
      },
      trelloApi: {
        fetchCardsByListId: [
          generateTrelloCard({
            actions: [
              generateTrelloCardAction({
                data: {
                  text: '**Pomello Log**\n \n---\n**Total time spent:** 30 minutes\n---\nTask stopped - *9:30 pm on Oct 9, 2022*\nTask started - *9:00 pm on Oct 9, 2022*\n \n>*#eyJ0b3RhbCI6MTgwMH0=*\n \n*Do not delete. Please avoid editing this comment.*',
                },
                id: 'MY_ACTION_ID',
              }),
            ],
            id: 'MY_CARD_ID',
          }),
        ],
      },
    });

    await simulate.selectTask('MY_CARD_ID');
    await simulate.startTimer();
    await simulate.advanceTimer(60);

    expect(mockUpdateComment).toHaveBeenLastCalledWith(
      'MY_ACTION_ID',
      '**Pomello Log**\n \n---\n**Total time spent:** 31 minutes\n---\nTask stopped - *1:03 pm on Oct 10, 2022*\nTask started - *1:02 pm on Oct 10, 2022*\nTask stopped - *9:30 pm on Oct 9, 2022*\nTask started - *9:00 pm on Oct 9, 2022*\n \n>*#eyJ0b3RhbCI6MTg2MH0=*\n \n*Do not delete. Please avoid editing this comment.*'
    );
  });

  it('should handle logs where the time spent is exactly one hour', async () => {
    const { simulate } = await renderTrelloService({
      config: {
        preferences: {
          global: {
            addChecks: false,
            keepLogs: true,
          },
        },
      },
      settings: {
        taskTime: 60,
      },
      trelloApi: {
        fetchCardsByListId: [
          generateTrelloCard({
            actions: [
              generateTrelloCardAction({
                data: {
                  text: '**Pomello Log**\n \n---\n**Total time spent:** 59 minutes\n---\nTask stopped - *9:59 pm on Oct 9, 2022*\nTask started - *9:00 pm on Oct 9, 2022*\n \n>*#eyJ0b3RhbCI6MzU0MH0=*\n \n*Do not delete. Please avoid editing this comment.*',
                },
                id: 'MY_ACTION_ID',
              }),
            ],
            id: 'MY_CARD_ID',
          }),
        ],
      },
    });

    await simulate.selectTask('MY_CARD_ID');
    await simulate.startTimer();
    await simulate.advanceTimer(60);

    expect(mockUpdateComment).toHaveBeenLastCalledWith(
      'MY_ACTION_ID',
      '**Pomello Log**\n \n---\n**Total time spent:** 1 hour\n---\nTask stopped - *1:03 pm on Oct 10, 2022*\nTask started - *1:02 pm on Oct 10, 2022*\nTask stopped - *9:59 pm on Oct 9, 2022*\nTask started - *9:00 pm on Oct 9, 2022*\n \n>*#eyJ0b3RhbCI6MzYwMH0=*\n \n*Do not delete. Please avoid editing this comment.*'
    );
  });

  it('should handle logs where the time spent is many hours', async () => {
    const { simulate } = await renderTrelloService({
      config: {
        preferences: {
          global: {
            addChecks: false,
            keepLogs: true,
          },
        },
      },
      settings: {
        taskTime: 60,
      },
      trelloApi: {
        fetchCardsByListId: [
          generateTrelloCard({
            actions: [
              generateTrelloCardAction({
                data: {
                  text: '**Pomello Log**\n \n---\n**Total time spent:** 2 hours and 30 minutes\n---\nTask stopped - *11:30 pm on Oct 9, 2022*\nTask started - *9:00 pm on Oct 9, 2022*\n \n>*#eyJ0b3RhbCI6OTAwMH0=*\n \n*Do not delete. Please avoid editing this comment.*',
                },
                id: 'MY_ACTION_ID',
              }),
            ],
            id: 'MY_CARD_ID',
          }),
        ],
      },
    });

    await simulate.selectTask('MY_CARD_ID');
    await simulate.startTimer();
    await simulate.advanceTimer(60);

    expect(mockUpdateComment).toHaveBeenLastCalledWith(
      'MY_ACTION_ID',
      '**Pomello Log**\n \n---\n**Total time spent:** 2 hours and 31 minutes\n---\nTask stopped - *1:03 pm on Oct 10, 2022*\nTask started - *1:02 pm on Oct 10, 2022*\nTask stopped - *11:30 pm on Oct 9, 2022*\nTask started - *9:00 pm on Oct 9, 2022*\n \n>*#eyJ0b3RhbCI6OTA2MH0=*\n \n*Do not delete. Please avoid editing this comment.*'
    );
  });

  it('should add a task voided entry when a task is voided mid-timer', async () => {
    const { simulate } = await renderTrelloService({
      config: {
        preferences: {
          global: {
            addChecks: false,
            keepLogs: true,
          },
        },
      },
      settings: {
        taskTime: 60,
      },
      trelloApi: {
        fetchCardsByListId: [generateTrelloCard({ id: 'MY_CARD_ID' })],
      },
    });

    await simulate.selectTask('MY_CARD_ID');
    await simulate.startTimer();
    await simulate.advanceTimer(30);
    await simulate.hotkey('voidTask');

    expect(mockUpdateComment).toHaveBeenLastCalledWith(
      'TRELLO_ACTION_ID',
      '**Pomello Log**\n \n---\n**Total time spent:** **\n---\nTask voided - *1:02 pm on Oct 10, 2022*\nTask started - *1:02 pm on Oct 10, 2022*\n \n>*#eyJ0b3RhbCI6MH0=*\n \n*Do not delete. Please avoid editing this comment.*'
    );
  });

  it('should add a task voided entry when a task is voided after a timer ends', async () => {
    const { simulate } = await renderTrelloService({
      config: {
        preferences: {
          global: {
            addChecks: false,
            keepLogs: true,
          },
        },
      },
      settings: {
        taskTime: 60,
      },
      trelloApi: {
        fetchCardsByListId: [generateTrelloCard({ id: 'MY_CARD_ID' })],
      },
    });

    await simulate.selectTask('MY_CARD_ID');
    await simulate.startTimer();
    await simulate.advanceTimer(60);
    await simulate.hotkey('voidTask');

    expect(mockUpdateComment).toHaveBeenLastCalledWith(
      'TRELLO_ACTION_ID',
      '**Pomello Log**\n \n---\n**Total time spent:** **\n---\nTask voided - *1:03 pm on Oct 10, 2022*\nTask started - *1:02 pm on Oct 10, 2022*\n \n>*#eyJ0b3RhbCI6MH0=*\n \n*Do not delete. Please avoid editing this comment.*'
    );
  });

  it('should add a task voided entry when a switched task is voided after a timer ends', async () => {
    const { simulate } = await renderTrelloService({
      config: {
        preferences: {
          global: {
            addChecks: false,
            keepLogs: true,
          },
        },
      },
      settings: {
        taskTime: 120,
      },
      trelloApi: {
        fetchCardsByListId: [
          generateTrelloCard({ id: 'MY_CARD_ID' }),
          generateTrelloCard({ id: 'MY_SECOND_CARD_ID' }),
        ],
      },
    });

    await simulate.selectTask('MY_CARD_ID');
    await simulate.startTimer();
    await simulate.advanceTimer(60);
    await simulate.hotkey('switchTask');
    await simulate.selectTask('MY_SECOND_CARD_ID');
    await simulate.advanceTimer(60);
    await simulate.hotkey('voidTask');

    expect(mockUpdateComment).toHaveBeenLastCalledWith(
      'TRELLO_ACTION_ID',
      '**Pomello Log**\n \n---\n**Total time spent:** **\n---\nTask voided - *1:04 pm on Oct 10, 2022*\nTask started - *1:03 pm on Oct 10, 2022*\n \n>*#eyJ0b3RhbCI6MH0=*\n \n*Do not delete. Please avoid editing this comment.*'
    );
  });

  it('should add a check item voided entry when a check item is voided mid-timer', async () => {
    const { simulate } = await renderTrelloService({
      config: {
        preferences: {
          global: {
            addChecks: false,
            keepLogs: true,
          },
        },
      },
      settings: {
        taskTime: 60,
      },
      trelloApi: {
        fetchCardsByListId: [
          generateTrelloCard({
            checklists: [
              generateTrelloChecklist({
                checkItems: [
                  generateTrelloCheckItem({
                    id: 'MY_CHECK_ITEM_ID',
                  }),
                ],
              }),
            ],
            id: 'MY_CARD_ID',
          }),
        ],
      },
    });

    await simulate.selectTask('MY_CHECK_ITEM_ID');
    await simulate.startTimer();
    await simulate.advanceTimer(30);
    await simulate.hotkey('voidTask');

    expect(mockUpdateComment).toHaveBeenLastCalledWith(
      'TRELLO_ACTION_ID',
      '**Pomello Log**\n \n---\n**Total time spent:** **\n---\nChecklist task voided - *1:02 pm on Oct 10, 2022*\nChecklist task started - *1:02 pm on Oct 10, 2022*\n \n>*#eyJ0b3RhbCI6MH0=*\n \n*Do not delete. Please avoid editing this comment.*'
    );
  });

  it('should add a check item voided entry when a task is voided after a timer ends', async () => {
    const { simulate } = await renderTrelloService({
      config: {
        preferences: {
          global: {
            addChecks: false,
            keepLogs: true,
          },
        },
      },
      settings: {
        taskTime: 60,
      },
      trelloApi: {
        fetchCardsByListId: [
          generateTrelloCard({
            checklists: [
              generateTrelloChecklist({
                checkItems: [generateTrelloCheckItem({ id: 'MY_CHECK_ITEM_ID' })],
              }),
            ],
            id: 'MY_CARD_ID',
          }),
        ],
      },
    });

    await simulate.selectTask('MY_CHECK_ITEM_ID');
    await simulate.startTimer();
    await simulate.advanceTimer(60);
    await simulate.hotkey('voidTask');

    expect(mockUpdateComment).toHaveBeenLastCalledWith(
      'TRELLO_ACTION_ID',
      '**Pomello Log**\n \n---\n**Total time spent:** **\n---\nChecklist task voided - *1:03 pm on Oct 10, 2022*\nChecklist task started - *1:02 pm on Oct 10, 2022*\n \n>*#eyJ0b3RhbCI6MH0=*\n \n*Do not delete. Please avoid editing this comment.*'
    );
  });

  it('should add a task moved entry when a card to moved to another list', async () => {
    const { simulate } = await renderTrelloService({
      config: {
        currentList: 'MY_FIRST_LIST',
        preferences: {
          global: {
            addChecks: false,
            keepLogs: true,
          },
        },
      },
      settings: {
        taskTime: 60,
      },
      trelloApi: {
        fetchBoardsAndLists: generateTrelloMember({
          boards: [
            generateTrelloBoard({
              lists: [
                generateTrelloList({ id: 'MY_FIRST_LIST' }),
                generateTrelloList({ id: 'MY_SECOND_LIST', name: 'My second list' }),
              ],
            }),
          ],
        }),
        fetchCardsByListId: [generateTrelloCard({ id: 'MY_CARD_ID' })],
      },
    });

    await simulate.selectTask('MY_CARD_ID');
    await simulate.startTimer();
    await simulate.advanceTimer(60);
    await simulate.selectOption('MY_SECOND_LIST');

    expect(mockUpdateComment).toHaveBeenLastCalledWith(
      'TRELLO_ACTION_ID',
      '**Pomello Log**\n \n---\n**Total time spent:** 1 minute\n---\nTask moved to **My second list** - *1:03 pm on Oct 10, 2022*\nTask stopped - *1:03 pm on Oct 10, 2022*\nTask started - *1:02 pm on Oct 10, 2022*\n \n>*#eyJ0b3RhbCI6NjB9*\n \n*Do not delete. Please avoid editing this comment.*'
    );
  });

  it('should add a check item completed entry when a card to marked as complete', async () => {
    const { simulate } = await renderTrelloService({
      config: {
        preferences: {
          global: {
            addChecks: false,
            keepLogs: true,
          },
        },
      },
      settings: {
        taskTime: 60,
      },
      trelloApi: {
        fetchCardsByListId: [
          generateTrelloCard({
            checklists: [
              generateTrelloChecklist({
                checkItems: [
                  generateTrelloCheckItem({
                    id: 'MY_CHECK_ITEM_ID',
                  }),
                ],
              }),
            ],
            id: 'MY_CARD_ID',
          }),
        ],
      },
    });

    const NotificationMock = vi.fn();

    vi.stubGlobal('Notification', NotificationMock);

    await simulate.selectTask('MY_CHECK_ITEM_ID');
    await simulate.startTimer();
    await simulate.advanceTimer(60);
    await simulate.hotkey('completeTaskEarly');

    expect(mockUpdateComment).toHaveBeenLastCalledWith(
      'TRELLO_ACTION_ID',
      '**Pomello Log**\n \n---\n**Total time spent:** 1 minute\n---\nChecklist task completed - *1:03 pm on Oct 10, 2022*\nChecklist task stopped - *1:03 pm on Oct 10, 2022*\nChecklist task started - *1:02 pm on Oct 10, 2022*\n \n>*#eyJ0b3RhbCI6NjB9*\n \n*Do not delete. Please avoid editing this comment.*'
    );
  });
});
