import mountApp, { screen, waitFor } from '../__fixtures__/mountApp';

describe('App - Select task', () => {
  it('should show a heading if provided', async () => {
    mountApp({
      mockService: {
        service: {
          getSelectTaskHeading: () => 'Choose wisely',
        },
      },
    });

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Choose wisely' })).toBeInTheDocument();
    });
  });
});
