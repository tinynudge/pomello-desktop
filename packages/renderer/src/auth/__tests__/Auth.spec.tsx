import { vi } from 'vitest';
import { renderAuth, screen, waitFor } from '../__fixtures__/renderAuth';
import { AuthView } from '../ui/AuthView';

describe('Auth', () => {
  it('should show the Pomello authorize view', () => {
    renderAuth({
      authWindow: { type: 'pomello', action: 'authorize' },
    });

    expect(
      screen.getByRole('heading', { name: 'Connect your Pomello account' })
    ).toBeInTheDocument();
    expect(screen.getByText('/api/authorize/', { exact: false })).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('should show the Pomello register view', () => {
    renderAuth({
      authWindow: { type: 'pomello', action: 'register' },
    });

    expect(
      screen.getByRole('heading', { name: 'Connect your Pomello account' })
    ).toBeInTheDocument();
    expect(screen.getByText('/api/register/', { exact: false })).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('should require a token to submit the form', async () => {
    const { userEvent } = renderAuth({
      authWindow: { type: 'pomello', action: 'authorize' },
    });

    await userEvent.click(screen.getByRole('button', { name: 'Submit' }));

    expect(screen.getByRole('alert')).toHaveTextContent('A valid token is required');

    await userEvent.type(screen.getByRole('textbox'), 'MY_SECRET_TOKEN');

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('should store the Pomello token when a valid token is entered', async () => {
    const { pomelloConfig, userEvent } = renderAuth({
      authWindow: { type: 'pomello', action: 'authorize' },
    });

    const encryptedToken = window.btoa(JSON.stringify({ pomelloToken: 'MY_SECRET_TOKEN' }));

    await userEvent.type(screen.getByRole('textbox'), encryptedToken);
    await userEvent.click(screen.getByRole('button', { name: 'Submit' }));

    await waitFor(() => {
      expect(pomelloConfig.set).toHaveBeenCalledWith('token', 'MY_SECRET_TOKEN');

      expect(
        screen.getByText('Success! You may now close your browser window.')
      ).toBeInTheDocument();
    });
  });

  it('should automatically close the window after a valid token is entered', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });

    const originalWindowClose = window.close;
    const mockWindowClose = vi.fn();
    window.close = mockWindowClose;

    const { userEvent } = renderAuth({
      authWindow: { type: 'pomello', action: 'authorize' },
    });

    const encryptedToken = window.btoa(JSON.stringify({ pomelloToken: 'MY_SECRET_TOKEN' }));

    await userEvent.type(screen.getByRole('textbox'), encryptedToken);
    await userEvent.click(screen.getByRole('button', { name: 'Submit' }));

    await screen.findByText('Success! You may now close your browser window.');

    let count = 0;
    while (count < 10) {
      vi.runOnlyPendingTimers();
      count += 1;
    }

    expect(mockWindowClose).toHaveBeenCalled();

    vi.runOnlyPendingTimers();
    vi.useRealTimers();
    window.close = originalWindowClose;
  });

  it('should show a service auth view if there is a serviceId', async () => {
    const MockAuthView = () => {
      return (
        <AuthView>
          <AuthView.Instructions
            authUrl="https://my-service.com"
            heading="My heading"
            logo="my-logo.png"
          />
        </AuthView>
      );
    };

    renderAuth({
      service: {
        AuthView: MockAuthView,
      },
      serviceId: 'mock',
    });

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'My heading' })).toBeInTheDocument();
      expect(screen.getByRole('presentation')).toHaveAttribute('src', 'my-logo.png');
      expect(screen.getByRole('link', { name: 'https://my-service.com' })).toBeInTheDocument();
    });
  });

  it('should open the auth link when clicked', async () => {
    const MockAuthView = () => {
      return (
        <AuthView>
          <AuthView.Instructions authUrl="https://my-service.com/" />
        </AuthView>
      );
    };

    const { appApi, userEvent } = renderAuth({
      service: {
        AuthView: MockAuthView,
      },
      serviceId: 'mock',
    });

    const link = await screen.findByRole('link', { name: 'https://my-service.com/' });
    await userEvent.click(link);

    expect(appApi.openUrl).toHaveBeenCalledWith('https://my-service.com/');
  });

  it('should call the onSubmit handler when a token is entered', async () => {
    const handleFormSubmit = vi.fn();

    const MockAuthView = () => {
      return (
        <AuthView>
          <AuthView.Instructions authUrl="https://my-service.com" />
          <AuthView.Form onSubmit={handleFormSubmit} />
        </AuthView>
      );
    };

    const { userEvent } = renderAuth({
      service: {
        AuthView: MockAuthView,
      },
      serviceId: 'mock',
    });

    await screen.findByRole('textbox');
    await userEvent.type(screen.getByRole('textbox'), 'MY_SECRET_TOKEN');
    await userEvent.click(screen.getByRole('button', { name: 'Submit' }));

    expect(handleFormSubmit).toHaveBeenCalledWith('MY_SECRET_TOKEN');
  });
});
