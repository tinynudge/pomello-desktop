import { renderDashboardComponent, screen } from '../__fixtures__/renderDashboardComponent';
import { Panel } from './Panel';

describe('UI - Panel', () => {
  it('should render the panel accordion', async () => {
    renderDashboardComponent(() => (
      <Panel heading="H.S.K.T.">
        <Panel.Accordion>
          <Panel.Accordion.Item title="Head">
            The upper part of the human body, or the front or upper part of the body of an animal,
            typically separated from the rest of the body by a neck, and containing the brain,
            mouth, and sense organs.
          </Panel.Accordion.Item>
        </Panel.Accordion>
      </Panel>
    ));

    expect(screen.getByRole('heading', { name: 'Head' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Head' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Head' })).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByRole('region', { name: 'Head' })).not.toBeInTheDocument();
  });

  it('should expand and collapse the panel accordion item when clicked', async () => {
    const { userEvent } = renderDashboardComponent(() => (
      <Panel heading="H.S.K.T.">
        <Panel.Accordion>
          <Panel.Accordion.Item title="Head">
            The upper part of the human body, or the front or upper part of the body of an animal,
            typically separated from the rest of the body by a neck, and containing the brain,
            mouth, and sense organs.
          </Panel.Accordion.Item>
        </Panel.Accordion>
      </Panel>
    ));

    const button = screen.getByRole('button', { name: 'Head' });

    await userEvent.click(button);

    expect(button).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('region', { name: 'Head' })).toBeInTheDocument();
    expect(screen.getByRole('region', { name: 'Head' })).toHaveTextContent(
      'The upper part of the human body, or the front or upper part of the body of an animal, typically separated from the rest of the body by a neck, and containing the brain, mouth, and sense organs.'
    );

    await userEvent.click(button);

    expect(button).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByRole('region', { name: 'Head' })).not.toBeInTheDocument();
  });

  it('should render extra content in the title if provided', async () => {
    renderDashboardComponent(() => (
      <Panel heading="H.S.K.T.">
        <Panel.Accordion>
          <Panel.Accordion.Item
            title="Head"
            titleExtras={<span data-testid="title-extras">Extra content</span>}
          >
            The upper part of the human body, or the front or upper part of the body of an animal,
            typically separated from the rest of the body by a neck, and containing the brain,
            mouth, and sense organs.
          </Panel.Accordion.Item>
        </Panel.Accordion>
      </Panel>
    ));

    expect(screen.getByTestId('title-extras')).toBeInTheDocument();
    expect(screen.getByTestId('title-extras')).toHaveTextContent('Extra content');
  });

  it('should render actions in the title if provided', async () => {
    const handleActionClick = vi.fn();

    const { userEvent } = renderDashboardComponent(() => (
      <Panel heading="H.S.K.T.">
        <Panel.Accordion>
          <Panel.Accordion.Item
            title="Head"
            actions={[
              {
                text: 'Action 1',
                onClick: handleActionClick,
              },
            ]}
          >
            The upper part of the human body, or the front or upper part of the body of an animal,
            typically separated from the rest of the body by a neck, and containing the brain,
            mouth, and sense organs.
          </Panel.Accordion.Item>
        </Panel.Accordion>
      </Panel>
    ));

    expect(screen.getByRole('button', { name: 'Head' })).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'Show more actions' }));

    expect(screen.getByRole('menu')).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: 'Action 1' })).toBeInTheDocument();

    await userEvent.click(screen.getByRole('menuitem', { name: 'Action 1' }));

    expect(handleActionClick).toHaveBeenCalled();
  });
});
