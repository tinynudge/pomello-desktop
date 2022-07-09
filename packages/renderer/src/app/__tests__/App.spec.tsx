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

  it('should prompt the user to select a service if not set', () => {
    mountApp({ serviceId: null });

    expect(screen.getByText(/select a service/i)).toBeInTheDocument();
  });

  it('should initialize the service when selected', () => {
    const InitializingView = () => <>Loading service</>;

    const { emitAppApiEvent } = mountApp({
      service: { InitializingView },
      serviceId: null,
    });

    emitAppApiEvent('onSelectChange', 'mock');

    expect(screen.getByText(/loading service/i)).toBeInTheDocument();
  });
});
