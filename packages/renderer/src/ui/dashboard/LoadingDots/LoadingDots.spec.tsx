import { renderDashboardComponent, screen } from '../__fixtures__/renderDashboardComponent';
import { LoadingDots } from './LoadingDots';

describe('UI - Loading Dots', () => {
  it('should render the loading dots', async () => {
    renderDashboardComponent(() => <LoadingDots />);

    expect(screen.getByRole('status', { name: 'Loading' })).toBeInTheDocument();
  });
});
