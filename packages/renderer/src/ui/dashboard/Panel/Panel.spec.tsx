import { renderComponent, screen } from '../../__fixtures__/renderComponent';
import { Panel } from './Panel';

describe('UI - Panel', () => {
  it('should render the panel', async () => {
    renderComponent(() => <Panel heading="Head shoulder knees and toes" />);

    expect(
      screen.getByRole('heading', { name: 'Head shoulder knees and toes', level: 2 })
    ).toBeInTheDocument();
  });

  it('should render the panel list', async () => {
    renderComponent(() => (
      <Panel heading="H.S.K.T.">
        <Panel.List aria-label="H.S.K.T.">
          <Panel.List.Item>Head</Panel.List.Item>
          <Panel.List.Item aria-hidden>Shoulders</Panel.List.Item>
          <Panel.List.Item>Knees</Panel.List.Item>
          <Panel.List.Item>Toes</Panel.List.Item>
        </Panel.List>
      </Panel>
    ));

    expect(screen.getByRole('list', { name: 'H.S.K.T.' })).toBeInTheDocument();
    expect(screen.getAllByRole('listitem')).toHaveLength(3);
  });
});
