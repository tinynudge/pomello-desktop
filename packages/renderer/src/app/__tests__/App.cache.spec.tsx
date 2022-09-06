import { CacheProvider } from '@/shared/context/CacheContext';
import createCache from '@/shared/helpers/createCache';
import useCache from '@/shared/hooks/useCache';
import { InitializingView, ServiceFactory } from '@domain';
import { vi } from 'vitest';
import mountApp, { screen, waitFor } from '../__fixtures__/mountApp';

describe('App - Cache', async () => {
  it('should reflect cache changes from the service in the UI', async () => {
    const InitializingView: InitializingView<{ onNameChange: () => void }> = ({ onNameChange }) => {
      const [cache] = useCache<{ name?: string }>();

      return (
        <div>
          <p>Hello, {cache.name}</p>
          <button onClick={onNameChange}>Change name</button>
        </div>
      );
    };

    const serviceWithCache: ServiceFactory = () => {
      const cache = createCache<{ name?: string }>();

      cache.set(draft => {
        draft.name = 'Brian';
      });

      const handleNameChange = () => {
        cache.set(draft => {
          draft.name = 'Tom';
        });
      };

      return {
        Container: ({ children }) => <CacheProvider cache={cache}>{children}</CacheProvider>,
        displayName: serviceWithCache.displayName,
        fetchTasks: () => Promise.resolve([]),
        id: serviceWithCache.id,
        InitializingView: props => <InitializingView {...props} onNameChange={handleNameChange} />,
      };
    };

    serviceWithCache.displayName = 'Mock Service with Cache';
    serviceWithCache.id = 'mockServiceWithCache';

    const { userEvent } = mountApp({
      createServiceRegistry: () => ({
        [serviceWithCache.id]: serviceWithCache,
      }),
      serviceId: serviceWithCache.id,
    });

    await waitFor(() => {
      expect(screen.getByText('Hello, Brian')).toBeInTheDocument();
    });

    await userEvent.click(screen.getByRole('button', { name: 'Change name' }));

    await waitFor(() => {
      expect(screen.getByText('Hello, Tom')).toBeInTheDocument();
    });
  });

  it('should reflect cache changes from the UI in the service', async () => {
    const handleCacheChange = vi.fn();

    const InitializingView: InitializingView = () => {
      const [cache, setCache] = useCache<{ name?: string }>();

      const handleNameChange = () => {
        setCache(draft => {
          draft.name = 'Harry';
        });
      };

      return (
        <div>
          <p>Hello, {cache.name}</p>
          <button onClick={handleNameChange}>Change name</button>
        </div>
      );
    };

    const serviceWithCache: ServiceFactory = () => {
      const cache = createCache<{ name?: string }>();

      cache.set(draft => {
        draft.name = 'Brian';
      });

      const removeCacheChangeHandler = cache.onChange(handleCacheChange);

      const onUnmount = () => {
        removeCacheChangeHandler();
      };

      return {
        Container: ({ children }) => <CacheProvider cache={cache}>{children}</CacheProvider>,
        displayName: serviceWithCache.displayName,
        fetchTasks: () => Promise.resolve([]),
        id: serviceWithCache.id,
        InitializingView,
        onUnmount,
      };
    };

    serviceWithCache.displayName = 'Mock Service with Cache';
    serviceWithCache.id = 'mockServiceWithCache';

    const { userEvent } = mountApp({
      createServiceRegistry: () => ({
        [serviceWithCache.id]: serviceWithCache,
      }),
      serviceId: serviceWithCache.id,
    });

    await waitFor(() => {
      expect(screen.getByText('Hello, Brian')).toBeInTheDocument();
    });

    await userEvent.click(screen.getByRole('button', { name: 'Change name' }));

    expect(handleCacheChange).toHaveBeenCalledTimes(1);
    expect(handleCacheChange).toHaveBeenCalledWith({ name: 'Harry' });
  });
});
