import { renderDashboardComponent, screen } from '../__fixtures__/renderDashboardComponent';
import { Panel } from './Panel';

describe('UI - Panel', () => {
  it('should render the panel', async () => {
    renderDashboardComponent(() => <Panel heading="Head shoulder knees and toes" />);

    expect(
      screen.getByRole('heading', { name: 'Head shoulder knees and toes', level: 2 })
    ).toBeInTheDocument();
  });

  it('should render the panel list', async () => {
    renderDashboardComponent(() => (
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

  it('should render the panel form field', async () => {
    renderDashboardComponent(() => (
      <Panel heading="Form">
        <Panel.List>
          <Panel.List.FormField description="What's in a name?" label="Name" for="name">
            <input id="name" type="text" />
          </Panel.List.FormField>
        </Panel.List>
      </Panel>
    ));

    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Name' })).toBeInTheDocument();
    expect(screen.getByText("What's in a name?")).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Show more options' })).not.toBeInTheDocument();
  });

  it('should render the panel form field actions', async () => {
    const { userEvent } = renderDashboardComponent(() => (
      <Panel heading="Form">
        <Panel.List>
          <Panel.List.FormField
            actions={[
              {
                onClick: () => {},
                text: 'Reset',
              },
            ]}
            label="Name"
            for="name"
          >
            <input id="name" type="text" />
          </Panel.List.FormField>
        </Panel.List>
      </Panel>
    ));

    expect(screen.getByRole('button', { name: 'Show more options' })).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'Show more options' }));

    expect(screen.getByRole('menu', { name: 'More options' })).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: 'Reset' })).toBeInTheDocument();
  });
});
