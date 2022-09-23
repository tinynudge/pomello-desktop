import useService from '@/shared/hooks/useService';
import { SpyInstance, vi } from 'vitest';
import mountApp, { screen, waitFor } from '../__fixtures__/mountApp';

describe('App - Errors', () => {
  let mockedConsole: SpyInstance;

  beforeEach(() => {
    mockedConsole = vi.spyOn(console, 'error');
    mockedConsole.mockImplementation(() => null);
  });

  afterEach(() => {
    mockedConsole.mockRestore();
  });

  it('should catch unexpected errors', async () => {
    mountApp({
      mockService: {
        service: {
          fetchTasks: () => Promise.reject(new Error('kaboom')),
        },
      },
    });

    await waitFor(() => {
      expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    });
  });

  it('should reset when the retry button is clicked', async () => {
    const { userEvent } = mountApp({
      mockService: {
        service: {
          fetchTasks: vi.fn().mockRejectedValueOnce('Nope').mockResolvedValueOnce([]),
        },
      },
    });

    const retryButton = await screen.findByRole('button', { name: 'Retry' });
    await userEvent.click(retryButton);

    expect(screen.getByRole('button', { name: 'Pick a task' })).toBeInTheDocument();
  });

  it('should copy the error message from the error dialog', async () => {
    const { appApi, userEvent } = mountApp({
      mockService: {
        service: {
          fetchTasks: () => Promise.reject('Nope'),
        },
      },
    });

    const detailsButton = await screen.findByRole('button', { name: 'Details' });

    await userEvent.click(detailsButton);

    expect(appApi.writeClipboardText).toHaveBeenCalled();
  });

  it('should allow for custom error handling from the services', async () => {
    mountApp({
      mockService: {
        service: {
          fetchTasks: () => Promise.reject('Nope'),
          handleError: () => <div>Something terrible happened</div>,
        },
      },
    });

    await waitFor(() => {
      expect(screen.getByText('Something terrible happened')).toBeInTheDocument();
    });
  });

  it('should allow for service related hooks to be used in a custom error component', async () => {
    const MockError = () => {
      const { displayName } = useService();

      return <div>Something terrible happened in {displayName}</div>;
    };

    mountApp({
      mockService: {
        service: {
          displayName: 'Terrible Service',
          fetchTasks: () => Promise.reject('Nope'),
          handleError: () => <MockError />,
        },
      },
    });

    await waitFor(() => {
      expect(
        screen.getByText('Something terrible happened in Terrible Service')
      ).toBeInTheDocument();
    });
  });

  it('should wrap the service container on a custom error component if provided', async () => {
    mountApp({
      mockService: {
        service: {
          fetchTasks: () => Promise.reject('Nope'),
          Container: ({ children }) => <article>I am a wrapper {children}</article>,
          handleError: () => <div>Something terrible happened</div>,
        },
      },
    });

    await waitFor(() => {
      expect(screen.getByText('I am a wrapper')).toBeInTheDocument();
      expect(screen.getByText('Something terrible happened')).toBeInTheDocument();
    });
  });
});
