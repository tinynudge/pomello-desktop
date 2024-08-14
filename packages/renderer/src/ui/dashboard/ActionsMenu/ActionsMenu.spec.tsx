import { renderDashboardComponent, screen } from '../__fixtures__/renderDashboardComponent';
import { ActionsMenu } from './ActionsMenu';

describe('UI - ActionsMenu', () => {
  it('should allow custom labels', async () => {
    const { userEvent } = renderDashboardComponent(() => (
      <ActionsMenu
        menuItems={[
          {
            text: 'One',
            onClick: () => {},
          },
        ]}
        menuLabel="Secret menu"
        tooltip="Nothing to see here"
        triggerLabel="Do not press"
      />
    ));

    const button = screen.getByRole('button', { name: 'Do not press' });

    await userEvent.hover(button);

    expect(screen.getByRole('tooltip', { name: 'Nothing to see here' }));

    await userEvent.click(button);

    expect(screen.getByRole('menu', { name: 'Secret menu' })).toBeInTheDocument();
  });
});
