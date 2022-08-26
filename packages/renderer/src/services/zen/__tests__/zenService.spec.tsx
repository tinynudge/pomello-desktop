import mountZenService, { screen, waitFor } from '../__fixtures__/mountZenService';

describe('Zen mode service', () => {
  it('should show an input as the select task view', async () => {
    mountZenService();

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Enter task')).toBeInTheDocument();
    });
  });

  it('should set the entered task as the current task', async () => {
    const results = mountZenService();

    await results.simulate.enterNote('Buy milk{Enter}');

    expect(screen.getByText('Buy milk')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Start timer' })).toBeInTheDocument();
  });
});
