import { HttpResponse } from 'msw';
import { vi } from 'vitest';
import { generateTrelloBoard } from '../__fixtures__/generateTrelloBoard';
import { generateTrelloCard } from '../__fixtures__/generateTrelloCard';
import { generateTrelloCardAction } from '../__fixtures__/generateTrelloCardAction';
import { generateTrelloCheckItem } from '../__fixtures__/generateTrelloCheckItem';
import { generateTrelloChecklist } from '../__fixtures__/generateTrelloChecklist';
import { generateTrelloList } from '../__fixtures__/generateTrelloList';
import { generateTrelloMember } from '../__fixtures__/generateTrelloMember';
import { renderTrelloService, screen, waitFor } from '../__fixtures__/renderTrelloService';
import { addComment } from '../api/addComment';
import { updateComment } from '../api/updateComment';

describe('Trello service - Add note', () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });

    const date = new Date(2022, 9, 10, 13, 2, 23);
    vi.setSystemTime(date);

    vi.mock('../api/addComment');
    vi.mock('../api/updateComment');
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('should update the comment log if the user enabled logs', async () => {
    const mockUpdateComment = vi.mocked(updateComment);

    const { simulate, userEvent } = await renderTrelloService({
      config: {
        preferences: {
          global: {
            keepLogs: true,
          },
        },
      },
      trelloApi: {
        fetchBoardsAndLists: generateTrelloMember({ id: 'USER_ID' }),
        fetchCardsByListId: [
          generateTrelloCard({
            actions: [
              generateTrelloCardAction({
                id: 'MY_COMMENT_ID',
                data: {
                  text: '**Pomello Log**\n \n---\n**Total time spent:** 1 minute\n---\nTask stopped  - *3:04 pm on Aug 22, 2022\n \n>*#eyJ0b3RhbCI6MH0=*\n \n*Do not delete. Please avoid editing this comment.*',
                },
                type: 'commentCard',
                memberCreator: {
                  id: 'USER_ID',
                },
              }),
            ],
          }),
        ],
      },
    });

    await simulate.selectTask();
    await simulate.hotkey('addNote');
    await userEvent.type(screen.getByRole('textbox'), 'Find out who the muffin man is{Enter}');

    expect(mockUpdateComment).toHaveBeenCalledWith(
      'MY_COMMENT_ID',
      '**Pomello Log**\n \n---\n**Total time spent:** 1 minute\n---\n**Note:** Find out who the muffin man is - *1:02 pm on Oct 10, 2022*\nTask stopped  - *3:04 pm on Aug 22, 2022\n \n>*#eyJ0b3RhbCI6MH0=*\n \n*Do not delete. Please avoid editing this comment.*'
    );
  });

  it('should add a comment if the user enabled logs but no comment log exists', async () => {
    const mockAddComment = vi.mocked(addComment);

    const { simulate, userEvent } = await renderTrelloService({
      config: {
        preferences: {
          global: {
            keepLogs: true,
          },
        },
      },
      trelloApi: {
        fetchBoardsAndLists: generateTrelloMember({ id: 'USER_ID' }),
        fetchCardsByListId: [generateTrelloCard({ id: 'MY_CARD_ID', actions: [] })],
      },
    });

    await simulate.selectTask('MY_CARD_ID');
    await simulate.hotkey('addNote');
    await userEvent.type(screen.getByRole('textbox'), 'Find out who the muffin man is{Enter}');

    expect(mockAddComment).toHaveBeenCalledWith(
      'MY_CARD_ID',
      '**Pomello Log**\n \n---\n**Total time spent:** **\n---\n**Note:** Find out who the muffin man is - *1:02 pm on Oct 10, 2022*\n \n>*#eyJ0b3RhbCI6MH0=*\n \n*Do not delete. Please avoid editing this comment.*'
    );
  });

  it('should create a new comment if the existing log is too large', async () => {
    const mockAddComment = vi.mocked(addComment);

    const mockEntries = Array(395).fill('Task stopped  - *3:04 pm on Aug 22, 2022').join('\n');

    const { simulate, userEvent } = await renderTrelloService({
      config: {
        preferences: {
          global: {
            keepLogs: true,
          },
        },
      },
      trelloApi: {
        fetchBoardsAndLists: generateTrelloMember({ id: 'USER_ID' }),
        fetchCardsByListId: [
          generateTrelloCard({
            id: 'MY_CARD_ID',
            actions: [
              generateTrelloCardAction({
                data: {
                  text: `**Pomello Log**\n \n---\n**Total time spent:** 1 minute\n---\n${mockEntries}\n \n>*#eyJ0b3RhbCI6MH0=*\n \n*Do not delete. Please avoid editing this comment.*`,
                },
                type: 'commentCard',
                memberCreator: {
                  id: 'USER_ID',
                },
              }),
            ],
          }),
        ],
      },
    });

    await simulate.selectTask('MY_CARD_ID');
    await simulate.hotkey('addNote');
    await userEvent.type(screen.getByRole('textbox'), 'Find out who the muffin man is{Enter}');

    expect(mockAddComment).toHaveBeenCalledWith(
      'MY_CARD_ID',
      '**Pomello Log** *(cont.)*\n \n---\n**Total time spent:** 1 minute\n---\n**Note:** Find out who the muffin man is - *1:02 pm on Oct 10, 2022*\n \n>*#eyJ0b3RhbCI6MH0=*\n \n*Do not delete. Please avoid editing this comment.*'
    );
  });

  it('should add a comment to the parent card if the current task is a check item', async () => {
    const mockUpdateComment = vi.mocked(updateComment);

    const { simulate, userEvent } = await renderTrelloService({
      config: {
        preferences: {
          global: {
            keepLogs: true,
          },
        },
      },
      trelloApi: {
        fetchBoardsAndLists: generateTrelloMember({ id: 'USER_ID' }),
        fetchCardsByListId: [
          generateTrelloCard({
            actions: [
              generateTrelloCardAction({
                id: 'MY_COMMENT_ID',
                data: {
                  text: '**Pomello Log**\n \n---\n**Total time spent:** 1 minute\n---\nTask stopped  - *3:04 pm on Aug 22, 2022\n \n>*#eyJ0b3RhbCI6MH0=*\n \n*Do not delete. Please avoid editing this comment.*',
                },
                type: 'commentCard',
                memberCreator: {
                  id: 'USER_ID',
                },
              }),
            ],
            checklists: [
              generateTrelloChecklist({
                checkItems: [
                  generateTrelloCheckItem({
                    id: 'MY_CHECK_ITEM',
                  }),
                ],
              }),
            ],
          }),
        ],
      },
    });

    await simulate.selectTask('MY_CHECK_ITEM');
    await simulate.hotkey('addNote');
    await userEvent.type(screen.getByRole('textbox'), 'Find out who the muffin man is{Enter}');

    expect(mockUpdateComment).toHaveBeenCalledWith(
      'MY_COMMENT_ID',
      '**Pomello Log**\n \n---\n**Total time spent:** 1 minute\n---\n**Note:** Find out who the muffin man is - *1:02 pm on Oct 10, 2022*\nTask stopped  - *3:04 pm on Aug 22, 2022\n \n>*#eyJ0b3RhbCI6MH0=*\n \n*Do not delete. Please avoid editing this comment.*'
    );
  });

  it('should add a comment if the user disabled logs', async () => {
    const mockAddComment = vi.mocked(addComment);

    const { simulate, userEvent } = await renderTrelloService({
      config: {
        preferences: {
          global: {
            keepLogs: false,
          },
        },
      },
      trelloApi: {
        fetchCardsByListId: [generateTrelloCard({ id: 'INVESTIGATION', name: 'My investigation' })],
      },
    });

    await simulate.selectTask('INVESTIGATION');
    await simulate.hotkey('addNote');
    await userEvent.type(screen.getByRole('textbox'), 'Find out who the muffin man is{Enter}');

    expect(mockAddComment).toHaveBeenCalledWith('INVESTIGATION', '**Note:** Find out who the muffin man is');
  });

  it('should handle a malformed encoded JSON string in the comment log', async () => {
    const mockUpdateComment = vi.mocked(updateComment);

    const { simulate, userEvent } = await renderTrelloService({
      config: {
        preferences: {
          global: {
            keepLogs: true,
          },
        },
      },
      trelloApi: {
        fetchBoardsAndLists: generateTrelloMember({ id: 'USER_ID' }),
        fetchCardsByListId: [
          generateTrelloCard({
            actions: [
              generateTrelloCardAction({
                id: 'MY_COMMENT_ID',
                data: {
                  text: '**Pomello Log**\n \n---\n**Total time spent:** 1 minute\n---\nTask stopped  - *3:04 pm on Aug 22, 2022\n \n>*#BAD_ENCODED_JSON*\n \n*Do not delete. Please avoid editing this comment.*',
                },
                type: 'commentCard',
                memberCreator: {
                  id: 'USER_ID',
                },
              }),
            ],
          }),
        ],
      },
    });

    await simulate.selectTask();
    await simulate.hotkey('addNote');
    await userEvent.type(screen.getByRole('textbox'), 'Find out who the muffin man is{Enter}');

    expect(mockUpdateComment).toHaveBeenCalledWith(
      'MY_COMMENT_ID',
      '**Pomello Log**\n \n---\n**Total time spent:** 1 minute\n---\n**Note:** Find out who the muffin man is - *1:02 pm on Oct 10, 2022*\nTask stopped  - *3:04 pm on Aug 22, 2022\n \n>*#eyJ0b3RhbCI6MH0=*\n \n*Do not delete. Please avoid editing this comment.*'
    );
  });

  it('should prompt the user to disable logs if unable to comment', async () => {
    let notificationCallback: () => void;

    const mockNotification = vi.fn(function () {
      return {
        addEventListener: (_event: string, callback: () => void) => {
          notificationCallback = callback;
        },
      };
    });
    vi.stubGlobal('Notification', mockNotification);

    const mockAddComment = vi.mocked(addComment);
    mockAddComment.mockRejectedValue(new Error('no commenting permissions'));

    const { config, simulate, userEvent } = await renderTrelloService({
      config: {
        currentList: 'LIST_ID',
        preferences: {
          lists: {
            LIST_ID: {
              addChecks: false,
              keepLogs: true,
            },
          },
        },
      },
      trelloApi: {
        addComment: () => {
          throw new HttpResponse('', { status: 401 });
        },
        fetchBoardsAndLists: generateTrelloMember({
          boards: [
            generateTrelloBoard({
              lists: [generateTrelloList({ id: 'LIST_ID' })],
            }),
          ],
        }),
        fetchCardsByListId: [generateTrelloCard({ actions: [], id: 'INVESTIGATION', name: 'My investigation' })],
      },
    });

    await simulate.selectTask('INVESTIGATION');
    await simulate.hotkey('addNote');
    await userEvent.type(screen.getByRole('textbox'), 'Find out who the muffin man is{Enter}');

    await waitFor(() => {
      expect(mockNotification).toHaveBeenCalledWith('Unable to update Trello log', {
        body: 'You do not have permissions to comment on this card. Click here to disable logging for this list.',
      });

      notificationCallback();

      expect(config.get().preferences?.lists?.LIST_ID).toEqual({
        addChecks: false,
        keepLogs: false,
      });
    });
  });
});
