import { renderDashboardComponent, screen } from '../__fixtures__/renderDashboardComponent';
import { Input } from './Input';

describe('UI - Input', () => {
  it('should render the input', async () => {
    renderDashboardComponent(() => <Input value="foo" />);

    expect(screen.getByRole('textbox')).toHaveValue('foo');
  });

  it('should render an error', async () => {
    renderDashboardComponent(() => <Input message={{ type: 'error', text: 'You shall not pass' }} value="two" />);

    expect(screen.getByRole('status')).toHaveTextContent('You shall not pass');
  });

  it('should render a warning', async () => {
    renderDashboardComponent(() => <Input message={{ type: 'warning', text: 'This is a warning' }} value="three" />);

    expect(screen.getByRole('status')).toHaveTextContent('This is a warning');
  });
});
