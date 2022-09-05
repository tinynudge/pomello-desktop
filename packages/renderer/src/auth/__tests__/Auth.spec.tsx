import { act } from 'react-dom/test-utils';
import { vi } from 'vitest';
import AuthView from '../ui/AuthView';
import mountAuth, { screen, waitFor } from '../__fixtures__/mountAuth';

describe('Auth', () => {
  it('should show the Pomello auth view if no service id is selected', () => {
    mountAuth();

    expect(
      screen.getByRole('heading', { name: 'Connect your Pomello account' })
    ).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('should require a token to submit the form', async () => {
    const { userEvent } = mountAuth();

    await userEvent.click(screen.getByRole('button', { name: 'Submit' }));

    expect(screen.getByRole('alert')).toHaveTextContent('A valid token is required');

    await userEvent.type(screen.getByRole('textbox'), 'MY_SECRET_TOKEN');

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('should store the Pomello token when a valid token is entered', async () => {
    const pomelloServiceConfig = {
      get: vi.fn(),
      onChange: vi.fn(),
      set: vi.fn(),
      unregister: vi.fn(),
      unset: vi.fn(),
    };

    const { userEvent } = mountAuth({
      appApi: {
        getPomelloServiceConfig: () => Promise.resolve(pomelloServiceConfig),
      },
    });

    await userEvent.type(screen.getByRole('textbox'), 'MY_SECRET_TOKEN');
    await userEvent.click(screen.getByRole('button', { name: 'Submit' }));

    await waitFor(() => {
      expect(pomelloServiceConfig.set).toHaveBeenCalledWith('token', 'MY_SECRET_TOKEN');

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

    const { userEvent } = mountAuth();

    await userEvent.type(screen.getByRole('textbox'), 'MY_SECRET_TOKEN');
    await userEvent.click(screen.getByRole('button', { name: 'Submit' }));

    await screen.findByText('Success! You may now close your browser window.');

    let count = 0;
    while (count < 10) {
      act(() => {
        vi.runOnlyPendingTimers();
      });
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

    mountAuth({
      service: {
        AuthView: MockAuthView,
      },
      serviceId: 'mock',
    });

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'My heading' })).toBeInTheDocument();
      expect(screen.getByRole('img')).toHaveAttribute('src', 'my-logo.png');
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

    const { appApi, userEvent } = mountAuth({
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

    const { userEvent } = mountAuth({
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
