import generateTrelloBoard from '../__fixtures__/generateTrelloBoard';
import generateTrelloCard from '../__fixtures__/generateTrelloCard';
import generateTrelloList from '../__fixtures__/generateTrelloList';
import generateTrelloMember from '../__fixtures__/generateTrelloMember';
import mountTrelloService, { screen } from '../__fixtures__/mountTrelloService';

describe('Trello service - Task', () => {
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
        fetchCardsByListId: [generateTrelloCard({ id: 'become-rich', name: 'Become super rich' })],
      },
    });

    await simulate.selectTask('become-rich');

    expect(screen.getByRole('heading', { name: 'World Domination: Tasks' })).toBeInTheDocument();
  });
});
