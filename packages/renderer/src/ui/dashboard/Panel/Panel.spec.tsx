import { renderDashboardComponent, screen } from '../__fixtures__/renderDashboardComponent';
import { Panel } from './Panel';

describe('UI - Panel', () => {
  it('should render the panel', async () => {
    renderDashboardComponent(() => <Panel heading="Head shoulder knees and toes" />);

    expect(
      screen.getByRole('heading', { name: 'Head shoulder knees and toes', level: 2 })
    ).toBeInTheDocument();
  });

  it('should render a subheading if provided', async () => {
    renderDashboardComponent(() => (
      <Panel
        heading="Head shoulder knees and toes"
        subHeading="And eyes and ears and mouth and nose"
      />
    ));

    expect(screen.getByText('And eyes and ears and mouth and nose')).toBeInTheDocument();
  });
});
