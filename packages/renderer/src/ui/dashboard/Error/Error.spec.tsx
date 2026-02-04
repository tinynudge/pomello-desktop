import { renderDashboardComponent, screen } from '../__fixtures__/renderDashboardComponent';
import { Error as ErrorComponent } from './Error';

describe('UI - Error', () => {
  it('should render the error', async () => {
    renderDashboardComponent(() => <ErrorComponent error={new Error('💣')} retry={() => {}} />);

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Details' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Retry' })).toBeInTheDocument();
  });

  it('should render a custom error message', async () => {
    renderDashboardComponent(() => (
      <ErrorComponent error={new Error('💣')} message="Custom error message" retry={() => {}} />
    ));

    expect(screen.getByText('Custom error message')).toBeInTheDocument();
  });

  it('should call the retry function when clicking the retry button', async () => {
    const retry = vi.fn();
    const { userEvent } = renderDashboardComponent(() => <ErrorComponent error={new Error('💣')} retry={retry} />);

    await userEvent.click(screen.getByRole('button', { name: 'Retry' }));

    expect(retry).toHaveBeenCalledTimes(1);
  });

  it('should show the error details when clicking the details button', async () => {
    const { appApi, userEvent } = renderDashboardComponent(() => (
      <ErrorComponent error={new Error('💣')} retry={() => {}} />
    ));
    await userEvent.click(screen.getByRole('button', { name: 'Details' }));

    expect(appApi.showMessageBox).toHaveBeenCalledWith(
      expect.objectContaining({
        buttons: ['Copy Error', 'Cancel'],
        cancelId: 1,
        defaultId: 0,
        message: 'An unexpected error occurred: 💣',
        type: 'error',
      })
    );
  });
});
