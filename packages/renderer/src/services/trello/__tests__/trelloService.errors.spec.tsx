import mockServer from '@/__fixtures__/mockServer';
import { ResponseResolver, rest, RestContext, RestRequest } from 'msw';
import { SpyInstance, vi } from 'vitest';
import { TRELLO_API_URL } from '../constants';
import { TrelloMember } from '../domain';
import generateTrelloMember from '../__fixtures__/generateTrelloMember';
import mountTrelloService, { screen, waitFor } from '../__fixtures__/mountTrelloService';

describe('Trello service - Errors', () => {
  let mockedConsole: SpyInstance;

  const resolveAuthError: ResponseResolver<RestRequest, RestContext> = (
    _request,
    response,
    context
  ) => {
    return response(context.status(401), context.json('invalid token'));
  };

  const resolveServerError: ResponseResolver<RestRequest, RestContext> = (
    _request,
    response,
    context
  ) => response.once(context.status(500));

  beforeAll(() => {
    mockedConsole = vi.spyOn(console, 'error');
    mockedConsole.mockImplementation(() => null);
  });

  afterAll(() => {
    mockedConsole.mockRestore();
  });

  it('should handle Trello authorization errors', async () => {
    const { appApi, userEvent } = await mountTrelloService({
      trelloApi: {
        fetchBoardsAndLists: resolveAuthError,
      },
    });

    const detailsButton = await screen.findByRole('button', { name: 'Details' });

    await userEvent.click(detailsButton);

    expect(screen.getByText('Authorization error')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sign in' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Details' })).toBeInTheDocument();
    expect(appApi.showMessageBox).toHaveBeenCalledWith({
      buttons: ['Sign In', 'Copy Error', 'Cancel'],
      cancelId: 2,
      defaultId: 0,
      message: 'There was an issue with your Trello authorization token. Please sign in again.',
      type: 'error',
    });
  });

  it('should open the auth window from the sign in button', async () => {
    const { appApi, userEvent } = await mountTrelloService({
      trelloApi: {
        fetchBoardsAndLists: resolveAuthError,
      },
    });

    const signInButton = await screen.findByRole('button', { name: 'Sign in' });

    await userEvent.click(signInButton);

    expect(appApi.showAuthWindow).toHaveBeenCalledWith('trello');
  });

  it('should open the auth window from the authorization error dialog', async () => {
    const { appApi, userEvent } = await mountTrelloService({
      appApi: {
        showMessageBox: vi.fn().mockResolvedValue({ response: 0 }),
      },
      trelloApi: {
        fetchBoardsAndLists: resolveAuthError,
      },
    });

    const detailsButton = await screen.findByRole('button', { name: 'Details' });

    await userEvent.click(detailsButton);

    expect(appApi.showAuthWindow).toHaveBeenCalledWith('trello');
  });

  it('should copy the error message from the authorization error dialog', async () => {
    const { appApi, userEvent } = await mountTrelloService({
      appApi: {
        showMessageBox: vi.fn().mockResolvedValue({ response: 1 }),
      },
      trelloApi: {
        fetchBoardsAndLists: resolveAuthError,
      },
    });

    const detailsButton = await screen.findByRole('button', { name: 'Details' });

    await userEvent.click(detailsButton);

    expect(appApi.writeClipboardText).toHaveBeenCalled();
  });

  it('should refetch the request when signed in', async () => {
    const { config, userEvent } = await mountTrelloService({
      config: {
        token: 'MY_BAD_TOKEN',
      },
      trelloApi: {
        fetchBoardsAndLists: resolveAuthError,
      },
    });

    const signInButton = await screen.findByRole('button', { name: 'Sign in' });

    await userEvent.click(signInButton);

    mockServer.use(
      rest.get(`${TRELLO_API_URL}members/me`, (_request, response, context) =>
        response(context.json(generateTrelloMember()))
      )
    );

    config.set('token', 'MY_NEW_TOKEN');

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Pick a task' })).toBeInTheDocument();
    });
  });

  it('should handle server errors', async () => {
    const { appApi, userEvent } = await mountTrelloService({
      trelloApi: {
        fetchBoardsAndLists: resolveServerError,
      },
    });

    const detailsButton = await screen.findByRole('button', { name: 'Details' });

    await userEvent.click(detailsButton);

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Retry' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Details' })).toBeInTheDocument();
    expect(appApi.showMessageBox).toHaveBeenCalledWith({
      buttons: ['Copy Error', 'Cancel'],
      cancelId: 1,
      defaultId: 0,
      message:
        'The Trello servers are not responding and may be experiencing an outage. Please try again later.',
      type: 'error',
    });
  });

  it('should refetch the request when retry is click', async () => {
    const { userEvent } = await mountTrelloService({
      trelloApi: {
        fetchBoardsAndLists: resolveServerError,
      },
    });

    const retryButton = await screen.findByRole('button', { name: 'Retry' });

    mockServer.use(
      rest.get(`${TRELLO_API_URL}members/me`, (_request, response, context) =>
        response(context.json(generateTrelloMember()))
      )
    );

    await userEvent.click(retryButton);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Pick a task' })).toBeInTheDocument();
    });
  });

  it('should copy the error message from the server error dialog', async () => {
    const { appApi, userEvent } = await mountTrelloService({
      appApi: {
        showMessageBox: vi.fn().mockResolvedValue({ response: 0 }),
      },
      trelloApi: {
        fetchBoardsAndLists: resolveServerError,
      },
    });

    const detailsButton = await screen.findByRole('button', { name: 'Details' });

    await userEvent.click(detailsButton);

    expect(appApi.writeClipboardText).toHaveBeenCalled();
  });

  it('should throw non-API related errors to the next boundary', async () => {
    await mountTrelloService({
      trelloApi: {
        fetchBoardsAndLists: {} as TrelloMember,
      },
    });

    await waitFor(() => {
      expect(screen.getByText('TODO: Error handler')).toBeInTheDocument();
    });
  });
});
