import { mockServer } from '@/__fixtures__/mockServer';
import { HttpResponse, http } from 'msw';
import { MockInstance, vi } from 'vitest';
import { generateTrelloMember } from '../__fixtures__/generateTrelloMember';
import { renderTrelloService, screen, waitFor } from '../__fixtures__/renderTrelloService';
import { TRELLO_API_URL } from '../constants';
import { TrelloMember } from '../domain';

describe('Trello service - Errors', () => {
  let mockedConsole: MockInstance;

  const resolveAuthError = () => {
    throw new HttpResponse('invalid token', { status: 401 });
  };

  const resolveServerError = () => {
    throw new HttpResponse(null, { status: 500 });
  };

  beforeAll(() => {
    mockedConsole = vi.spyOn(console, 'error');
    mockedConsole.mockImplementation(() => null);
  });

  afterAll(() => {
    mockedConsole.mockRestore();
  });

  it('should handle Trello authorization errors', async () => {
    const { appApi, userEvent } = await renderTrelloService({
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
    const { appApi, userEvent } = await renderTrelloService({
      trelloApi: {
        fetchBoardsAndLists: resolveAuthError,
      },
    });

    const signInButton = await screen.findByRole('button', { name: 'Sign in' });

    await userEvent.click(signInButton);

    expect(appApi.showAuthWindow).toHaveBeenCalledWith({
      type: 'service',
      serviceId: 'trello',
    });
  });

  it('should open the auth window from the authorization error dialog', async () => {
    const { appApi, userEvent } = await renderTrelloService({
      appApi: {
        showMessageBox: vi.fn().mockResolvedValue({ response: 0 }),
      },
      trelloApi: {
        fetchBoardsAndLists: resolveAuthError,
      },
    });

    const detailsButton = await screen.findByRole('button', { name: 'Details' });

    await userEvent.click(detailsButton);

    expect(appApi.showAuthWindow).toHaveBeenCalledWith({
      type: 'service',
      serviceId: 'trello',
    });
  });

  it('should copy the error message from the authorization error dialog', async () => {
    const { appApi, userEvent } = await renderTrelloService({
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
    const { config, userEvent } = await renderTrelloService({
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
      http.get(`${TRELLO_API_URL}members/me`, () => HttpResponse.json(generateTrelloMember()))
    );

    config.set('token', 'MY_NEW_TOKEN');

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Pick a task' })).toBeInTheDocument();
    });
  });

  it('should handle server errors', async () => {
    const { appApi, userEvent } = await renderTrelloService({
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
    const { userEvent } = await renderTrelloService({
      trelloApi: {
        fetchBoardsAndLists: resolveServerError,
      },
    });

    const retryButton = await screen.findByRole('button', { name: 'Retry' });

    mockServer.use(
      http.get(`${TRELLO_API_URL}members/me`, () => HttpResponse.json(generateTrelloMember()))
    );

    await userEvent.click(retryButton);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Pick a task' })).toBeInTheDocument();
    });
  });

  it('should copy the error message from the server error dialog', async () => {
    const { appApi, userEvent } = await renderTrelloService({
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
    await renderTrelloService({
      trelloApi: {
        fetchBoardsAndLists: {} as TrelloMember,
      },
    });

    await waitFor(() => {
      expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    });
  });
});
