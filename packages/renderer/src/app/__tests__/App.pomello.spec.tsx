import mountApp, { screen, waitFor } from '../__fixtures__/mountApp';

describe('App - Pomello', () => {
  it('should prompt the user to create an account for the first time', async () => {
    mountApp({
      pomelloConfig: {
        didPromptRegistration: false,
        token: undefined,
      },
    });

    await waitFor(() => {
      expect(screen.getByText('Create Pomello account to track productivity?')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Sure' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Not now' })).toBeInTheDocument();
    });
  });

  it('should not prompt the user to create an account if they already have a token', async () => {
    mountApp({
      pomelloConfig: {
        didPromptRegistration: false,
        token: 'MY_POMELLO_TOKEN',
      },
    });

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Pick a task' })).toBeInTheDocument();
    });
  });

  it('should open the auth window if they want to create an account', async () => {
    const { appApi, userEvent } = mountApp({
      pomelloConfig: {
        didPromptRegistration: false,
        token: undefined,
      },
    });

    const confirmButton = await screen.findByRole('button', { name: 'Sure' });
    await userEvent.click(confirmButton);

    expect(appApi.showAuthWindow).toHaveBeenCalled();
    expect(screen.getByRole('button', { name: 'Pick a task' })).toBeInTheDocument();
  });

  it('should navigate to the select task view if they decline to register an account', async () => {
    const { appApi, userEvent } = mountApp({
      pomelloConfig: {
        didPromptRegistration: false,
        token: undefined,
      },
    });

    const skipButton = await screen.findByRole('button', { name: 'Not now' });
    await userEvent.click(skipButton);

    expect(appApi.showAuthWindow).not.toHaveBeenCalled();
    expect(screen.getByRole('button', { name: 'Pick a task' })).toBeInTheDocument();
  });
});
