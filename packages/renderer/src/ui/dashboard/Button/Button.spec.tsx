import { renderDashboardComponent, screen } from '../__fixtures__/renderDashboardComponent';
import { Button } from './Button';

describe('UI - Button', () => {
  it('should render the button link', async () => {
    renderDashboardComponent(() => <Button data-foo>Hello world</Button>);

    expect(screen.getByRole('button', { name: 'Hello world' })).toBeInTheDocument();
    expect(screen.getByRole('button')).toHaveAttribute('data-foo');
  });
});
