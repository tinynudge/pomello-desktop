import useTranslation from '@/shared/hooks/useTranslation';
import { ServiceConfigStore } from '@domain';
import { vi } from 'vitest';
import mountApp, { screen } from '../__fixtures__/mountApp';

describe('App', () => {
  it('should show the menu when toggled', async () => {
    const originalGetBoundingClientRect = Element.prototype.getBoundingClientRect;
    Element.prototype.getBoundingClientRect = () => ({ width: 100 } as DOMRect);

    const { userEvent } = mountApp();

    await userEvent.click(screen.getByRole('button', { name: /open menu/i }));

    expect(screen.getByRole('button', { name: /home/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /dashboard/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create task/i })).toBeInTheDocument();

    Element.prototype.getBoundingClientRect = originalGetBoundingClientRect;
  });

  it('should toggle the menu via hotkey', async () => {
    const originalGetBoundingClientRect = Element.prototype.getBoundingClientRect;
    Element.prototype.getBoundingClientRect = () => ({ width: 100 } as DOMRect);

    const { simulate } = mountApp();

    await simulate.hotkey('toggleMenu');

    expect(screen.getByRole('button', { name: 'Close menu' })).toBeInTheDocument();

    Element.prototype.getBoundingClientRect = originalGetBoundingClientRect;
  });

  it('should prompt the user to select a service if not set', () => {
    mountApp({ serviceId: null });

    expect(screen.getByText(/select a service/i)).toBeInTheDocument();
  });

  it('should initialize the service when selected', async () => {
    const InitializingView = () => <>Loading service</>;

    const { simulate } = mountApp({
      mockService: {
        service: {
          InitializingView,
        },
      },
      serviceId: null,
    });

    await simulate.selectService('mock');

    expect(screen.getByText(/loading service/i)).toBeInTheDocument();
  });

  it('should register the service config if it exists', async () => {
    const { appApi, simulate } = mountApp({
      mockService: {
        config: {
          defaults: {
            foo: 'bar',
          },
          schema: {
            type: 'object',
            properties: {
              foo: { type: 'string' },
            },
            required: ['foo'],
          },
        } as unknown as ServiceConfigStore,
        service: {
          id: 'foo',
        },
      },
      serviceId: null,
    });

    await simulate.selectService('foo');

    expect(appApi.registerServiceConfig).toHaveBeenCalledWith('foo', {
      defaults: {
        foo: 'bar',
      },
      schema: {
        type: 'object',
        properties: {
          foo: { type: 'string' },
        },
        required: ['foo'],
      },
    });
  });

  it('should load service translations', async () => {
    const getTranslations = vi.fn().mockResolvedValue({
      helloWorld: 'Hello world!',
    });

    const InitializingView = () => {
      const { t } = useTranslation();

      return <>{t('service:helloWorld')}</>;
    };

    const { simulate } = mountApp({
      appApi: { getTranslations },
      mockService: {
        service: {
          InitializingView,
        },
      },
      serviceId: null,
    });

    await simulate.selectService('mock');

    expect(screen.getByText('Hello world!')).toBeInTheDocument();
  });
});
