import { renderDashboardComponent, screen, within } from '../__fixtures__/renderDashboardComponent';
import { Button } from './Button';

describe('UI - Button', () => {
  it('should render the button link', async () => {
    renderDashboardComponent(() => <Button data-foo>Hello world</Button>);

    expect(screen.getByRole('button', { name: 'Hello world' })).toBeInTheDocument();
    expect(screen.getByRole('button')).toHaveAttribute('data-foo');
  });

  it('should render a button group', async () => {
    renderDashboardComponent(() => (
      <Button.Group>
        <Button>Button 1</Button>
        <Button>Button 2</Button>
      </Button.Group>
    ));

    expect(screen.getByRole('group')).toBeInTheDocument();

    const group = screen.getByRole('group');

    expect(within(group).getByRole('button', { name: 'Button 1' })).toBeInTheDocument();
    expect(within(group).getByRole('button', { name: 'Button 2' })).toBeInTheDocument();
  });
});
