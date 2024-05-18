import { renderZenService, screen, waitFor } from '../__fixtures__/renderZenService';

describe('Zen mode service', () => {
  it('should show an input as the select task view', async () => {
    renderZenService();

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Enter task')).toBeInTheDocument();
    });
  });

  it('should set the entered task as the current task', async () => {
    const results = renderZenService();

    await results.simulate.enterNote('Buy milk{Enter}');

    expect(screen.getByText('Buy milk')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Start timer' })).toBeInTheDocument();
  });
});
