import mountTrelloService, { screen, waitFor } from '../__fixtures__/mountTrelloService';

describe('Trello service', () => {
  it('should show the login view if no token is present', async () => {
    mountTrelloService({
      config: {
        token: undefined,
      },
    });

    await waitFor(() => {
      expect(screen.getByText('Connect to Trello')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Sign in' })).toBeInTheDocument();
    });
  });
});
