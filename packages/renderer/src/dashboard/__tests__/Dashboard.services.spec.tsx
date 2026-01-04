import { DashboardRoute } from '@pomello-desktop/domain';
import { renderDashboard, screen, within } from '../__fixtures__/renderDashboard';

describe('Dashboard - Services', () => {
  it('should render the services', () => {
    renderDashboard({ route: DashboardRoute.Services });

    expect(screen.getByRole('heading', { name: 'Services', level: 1 })).toBeInTheDocument();
  });

  it('should render all the services available', () => {
    renderDashboard({
      route: DashboardRoute.Services,
      services: [
        {
          displayName: 'Service One',
          id: 'service-one',
        },
        {
          displayName: 'Service Two',
          id: 'service-two',
        },
      ],
    });

    const list = screen.getByRole('list', { name: 'All services' });

    expect(screen.getByRole('heading', { name: 'All services', level: 2 })).toBeInTheDocument();
    expect(list).toBeInTheDocument();

    const serviceItems = within(list).getAllByRole('listitem');

    expect(serviceItems).toHaveLength(2);
    expect(serviceItems.at(0)).toHaveTextContent('Service One');
    expect(serviceItems.at(1)).toHaveTextContent('Service Two');
  });

  it('should show configure button for services that support configuration', () => {
    renderDashboard({
      route: DashboardRoute.Services,
      services: [
        {
          displayName: 'Cannot Configure This Service',
          id: 'no-config-service',
        },
        {
          ConfigureView: () => <div>Configure view</div>,
          displayName: 'Configurable Service',
          id: 'config-service',
        },
      ],
    });

    const list = screen.getByRole('list', { name: 'All services' });
    const serviceItems = within(list).getAllByRole('listitem');

    expect(
      within(serviceItems[0]).queryByRole('button', { name: 'Configure' })
    ).not.toBeInTheDocument();
    expect(within(serviceItems[1]).getByRole('button', { name: 'Configure' })).toBeInTheDocument();
  });

  it("should show a service's configure view when clicking the configure button", async () => {
    const { userEvent } = renderDashboard({
      route: DashboardRoute.Services,
      services: [
        {
          ConfigureView: () => <div>Configure view</div>,
          displayName: 'Configurable Service',
          id: 'config-service',
        },
      ],
    });

    const list = screen.getByRole('list', { name: 'All services' });
    const serviceItem = within(list).getByRole('listitem');

    const configureButton = within(serviceItem).getByRole('button', { name: 'Configure' });

    await userEvent.click(configureButton);

    expect(screen.getByText('Configure view')).toBeInTheDocument();
  });
});
