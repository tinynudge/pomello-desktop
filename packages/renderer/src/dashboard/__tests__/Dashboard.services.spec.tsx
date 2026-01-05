import { createMockServiceFactory } from '@/__fixtures__/createMockService';
import { useConfigureServiceConfig } from '@/shared/context/ConfigureServiceConfigContext';
import { DashboardRoute } from '@pomello-desktop/domain';
import { JSX } from 'solid-js';
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
        createMockServiceFactory({
          service: {
            displayName: 'Service One',
            id: 'service-one',
          },
        }),
        createMockServiceFactory({
          service: {
            displayName: 'Service Two',
            id: 'service-two',
          },
        }),
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
        createMockServiceFactory({
          service: {
            displayName: 'Cannot Configure This Service',
            id: 'no-config-service',
          },
        }),
        createMockServiceFactory({
          service: {
            ConfigureView: () => <div>Configure view</div>,
            displayName: 'Configurable Service',
            id: 'config-service',
          },
        }),
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
        createMockServiceFactory({
          service: {
            ConfigureView: () => <div>Configure view</div>,
            displayName: 'Configurable Service',
            id: 'config-service',
          },
        }),
      ],
    });

    const list = screen.getByRole('list', { name: 'All services' });
    const serviceItem = within(list).getByRole('listitem');

    const configureButton = within(serviceItem).getByRole('button', { name: 'Configure' });

    await userEvent.click(configureButton);

    expect(screen.getByText('Configure view')).toBeInTheDocument();
  });

  it('should allow a service config to be edited and saved', async () => {
    const fooFactory = createMockServiceFactory({
      config: {
        defaults: {
          text: 'Hello',
        },
        schema: {
          type: 'object',
          properties: {
            text: { type: 'string', nullable: true },
          },
        },
      },
      service: {
        ConfigureView: () => {
          const { getServiceConfigValue, serviceConfig, stageServiceConfigValue } =
            useConfigureServiceConfig<{ text: string }>();

          const handleTextInput: JSX.EventHandler<HTMLInputElement, InputEvent> = event => {
            stageServiceConfigValue('text', event.currentTarget.value);
          };

          return (
            <>
              <input
                aria-label="Text Input"
                onInput={handleTextInput}
                value={getServiceConfigValue('text')}
              />
              <p data-testid="stored-value">{serviceConfig.text}</p>
            </>
          );
        },
        displayName: 'Foo Service',
        id: 'foo-service',
      },
    });

    const { userEvent } = renderDashboard({
      route: DashboardRoute.Services,
      services: [fooFactory],
    });

    const listItem = screen.getByRole('listitem', { name: /Foo Service/i });

    await userEvent.click(within(listItem).getByRole('button', { name: 'Configure' }));

    expect(screen.getByLabelText('Text Input')).toHaveValue('Hello');
    expect(screen.getByTestId('stored-value')).toHaveTextContent('Hello');

    await userEvent.clear(screen.getByLabelText('Text Input'));
    await userEvent.type(screen.getByLabelText('Text Input'), 'New Value');

    expect(screen.getByRole('status')).toHaveTextContent(
      'Your pending changes have not been saved yet.'
    );

    await userEvent.click(screen.getByRole('button', { name: 'Undo changes' }));

    expect(screen.getByLabelText('Text Input')).toHaveValue('Hello');
    expect(screen.getByTestId('stored-value')).toHaveTextContent('Hello');

    await userEvent.clear(screen.getByLabelText('Text Input'));
    await userEvent.type(screen.getByLabelText('Text Input'), 'New New Value');

    expect(screen.getByRole('status')).toHaveTextContent(
      'Your pending changes have not been saved yet.'
    );

    await userEvent.click(screen.getByRole('button', { name: 'Save changes' }));

    expect(screen.queryByRole('status')).not.toBeInTheDocument();
    expect(screen.getByLabelText('Text Input')).toHaveValue('New New Value');
    expect(screen.getByTestId('stored-value')).toHaveTextContent('New New Value');
  });
});
