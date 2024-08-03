import { renderDashboardComponent, screen } from '../__fixtures__/renderDashboardComponent';
import { ButtonLink } from './ButtonLink';

describe('UI - ButtonLink', () => {
  it('should render the button link', async () => {
    renderDashboardComponent(() => <ButtonLink data-foo>Hello world</ButtonLink>);

    expect(screen.getByRole('button', { name: 'Hello world' })).toBeInTheDocument();
    expect(screen.getByRole('button')).toHaveAttribute('data-foo');
  });
});
