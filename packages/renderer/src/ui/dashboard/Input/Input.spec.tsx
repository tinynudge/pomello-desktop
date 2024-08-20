import { renderDashboardComponent, screen } from '../__fixtures__/renderDashboardComponent';
import { Input } from './Input';

describe('UI - Input', () => {
  it('should render the input', async () => {
    renderDashboardComponent(() => <Input value="foo" />);

    expect(screen.getByRole('textbox')).toHaveValue('foo');
  });

  it('should render an error', async () => {
    renderDashboardComponent(() => <Input errorMessage="You shall not pass" value="two" />);

    expect(screen.getByRole('status')).toHaveTextContent('You shall not pass');
  });
});
