import { vi } from 'vitest';
import updateCard from '../api/updateCard';
import generateTrelloBoard from '../__fixtures__/generateTrelloBoard';
import generateTrelloCard from '../__fixtures__/generateTrelloCard';
import generateTrelloList from '../__fixtures__/generateTrelloList';
import generateTrelloMember from '../__fixtures__/generateTrelloMember';
import mountTrelloService, { screen } from '../__fixtures__/mountTrelloService';

vi.mock('../api/updateCard');

const mockUpdateCard = vi.mocked(updateCard);

describe('Trello service - Switch task', () => {
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

  it('should show the correct pomodoro count when switching tasks', async () => {
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
        fetchCardsByListId: [
          generateTrelloCard({ id: 'GROCERIES', name: 'Buy groceries' }),
          generateTrelloCard({ id: 'BILLIONAIRE', name: 'Become a billionaire' }),
        ],
      },
    });

    await simulate.selectTask('BILLIONAIRE');
    await simulate.startTimer();
    await simulate.advanceTimer(5);
    await simulate.hotkey('switchTask');
    await simulate.selectTask('GROCERIES');
    await simulate.advanceTimer();

    expect(mockUpdateCard).toHaveBeenNthCalledWith(1, {
      id: 'BILLIONAIRE',
      data: { name: '0.25 🍅 Become a billionaire' },
    });

    expect(mockUpdateCard).toHaveBeenNthCalledWith(2, {
      id: 'GROCERIES',
      data: { name: '0.75 🍅 Buy groceries' },
    });
  });

  it('should open the tasks lists after switching lists', async () => {
    const mockShowSelect = vi.fn();

    const { emitAppApiEvent, simulate } = await mountTrelloService({
      config: {
        currentList: 'FIRST_LIST',
      },
      appApi: {
        showSelect: mockShowSelect,
      },
      trelloApi: {
        fetchBoardsAndLists: generateTrelloMember({
          boards: [
            generateTrelloBoard({
              lists: [
                generateTrelloList({ id: 'FIRST_LIST', name: 'First list' }),
                generateTrelloList({ id: 'SECOND_LIST', name: 'Second list' }),
              ],
            }),
          ],
        }),
      },
    });

    await simulate.switchLists();
    await screen.findByRole('button', { name: 'Pick a list' });
    await simulate.selectOption('SECOND_LIST');
    await simulate.waitForSelectTaskView();
    emitAppApiEvent('onSelectReady');

    expect(mockShowSelect).toHaveBeenCalled();
  });
});
