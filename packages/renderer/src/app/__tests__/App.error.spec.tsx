import { MockInstance, vi } from 'vitest';
import { renderApp, screen, waitFor } from '../__fixtures__/renderApp';
import { useService } from '@/shared/context/ServiceContext';

describe('App - Errors', () => {
  let mockedConsole: MockInstance;

  beforeEach(() => {
    mockedConsole = vi.spyOn(console, 'error');
    mockedConsole.mockImplementation(() => null);
  });

  afterEach(() => {
    mockedConsole.mockRestore();
  });

  it('should catch unexpected errors', async () => {
    renderApp({
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
    const { userEvent } = renderApp({
      mockService: {
        service: {
          fetchTasks: vi.fn().mockRejectedValueOnce('Nope').mockResolvedValueOnce([]),
        },
      },
    });

    const retryButton = await screen.findByRole('button', { name: 'Retry' });

    await userEvent.click(retryButton);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Pick a task' })).toBeInTheDocument();
    });
  });

  it('should copy the error message from the error dialog', async () => {
    const { appApi, userEvent } = renderApp({
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
    renderApp({
      mockService: {
        service: {
          fetchTasks: () => Promise.reject('Nope'),
          handleError: () => () => <div>Something terrible happened</div>,
        },
      },
    });

    await waitFor(() => {
      expect(screen.getByText('Something terrible happened')).toBeInTheDocument();
    });
  });

  it('should allow for service related hooks to be used in a custom error component', async () => {
    const MockError = () => {
      const getService = useService();

      return <div>Something terrible happened in {getService().displayName}</div>;
    };

    renderApp({
      mockService: {
        service: {
          displayName: 'Terrible Service',
          fetchTasks: () => Promise.reject('Nope'),
          handleError: () => () => <MockError />,
        },
      },
    });

    await waitFor(() => {
      expect(screen.getByText('Something terrible happened in Terrible Service')).toBeInTheDocument();
    });
  });

  it('should wrap the service container on a custom error component if provided', async () => {
    renderApp({
      mockService: {
        service: {
          fetchTasks: () => Promise.reject('Nope'),
          Container: props => <article>I am a wrapper {props.children}</article>,
          handleError: () => () => <div>Something terrible happened</div>,
        },
      },
    });

    await waitFor(() => {
      expect(screen.getByText('I am a wrapper')).toBeInTheDocument();
      expect(screen.getByText('Something terrible happened')).toBeInTheDocument();
    });
  });
});
