import { CacheProvider } from '@/shared/context/CacheContext';
import createSignal from '@/shared/helpers/createSignal';
import useCache from '@/shared/hooks/useCache';
import useStore from '@/shared/hooks/useStore';
import { InitializingView, ServiceFactory } from '@domain';
import { vi } from 'vitest';
import mountApp, { screen, waitFor } from '../__fixtures__/mountApp';

interface MockCache {
  name?: string;
}

describe('App - Cache', async () => {
  it('should reflect cache changes from the service in the UI', async () => {
    const InitializingView: InitializingView<{ onNameChange: () => void }> = ({ onNameChange }) => {
      const cache = useCache<MockCache>();
      const cacheStore = useStore(cache.get, cache.subscribe);

      const name = cacheStore(cache => cache.name);

      return (
        <div>
          <p>Hello, {name}</p>
          <button onClick={onNameChange}>Change name</button>
        </div>
      );
    };

    const serviceWithCache: ServiceFactory = () => {
      const cache = createSignal<MockCache>({});

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

    await waitFor(async () => {
      expect(screen.getByText('Hello, Brian')).toBeInTheDocument();

      await userEvent.click(screen.getByRole('button', { name: 'Change name' }));

      expect(screen.getByText('Hello, Tom')).toBeInTheDocument();
    });
  });

  it('should reflect cache changes from the UI in the service', async () => {
    const handleCacheChange = vi.fn();

    const InitializingView: InitializingView = () => {
      const cache = useCache<MockCache>();
      const cacheStore = useStore(cache.get, cache.subscribe, {
        nameChanged: name => cache.set({ name }),
      });

      const name = cacheStore(cache => cache.name);

      const handleNameChange = () => {
        cacheStore.nameChanged('Harry');
      };

      return (
        <div>
          <p>Hello, {name}</p>
          <button onClick={handleNameChange}>Change name</button>
        </div>
      );
    };

    const serviceWithCache: ServiceFactory = () => {
      const cache = createSignal<MockCache>({ name: 'Brian' });

      const removeCacheChangeHandler = cache.subscribe(handleCacheChange);

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

    expect(handleCacheChange).toHaveBeenCalledTimes(2);
    expect(handleCacheChange).toHaveBeenLastCalledWith({ name: 'Harry' });
  });
});
