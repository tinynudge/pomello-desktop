import { generateTrelloBoard } from '../__fixtures__/generateTrelloBoard';
import { generateTrelloCard } from '../__fixtures__/generateTrelloCard';
import { generateTrelloList } from '../__fixtures__/generateTrelloList';
import { generateTrelloMember } from '../__fixtures__/generateTrelloMember';
import { screen, renderTrelloService } from '../__fixtures__/renderTrelloService';

describe('Trello service - Task', () => {
  it('should show the board and list in the heading', async () => {
    const { simulate } = await renderTrelloService({
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
        fetchCardsByListId: [generateTrelloCard({ id: 'become-rich', name: 'Become super rich' })],
      },
    });

    await simulate.selectTask('become-rich');

    expect(screen.getByRole('heading', { name: 'World Domination: Tasks' })).toBeInTheDocument();
  });

  it('should not show the pomodoro marker in the task label', async () => {
    const { simulate } = await renderTrelloService({
      trelloApi: {
        fetchCardsByListId: [generateTrelloCard({ id: 'become-kinda-rich', name: '6 🍅 Become kinda rich' })],
      },
    });

    await simulate.selectTask('become-kinda-rich');

    expect(screen.getByText('Become kinda rich')).toBeInTheDocument();
  });
});
