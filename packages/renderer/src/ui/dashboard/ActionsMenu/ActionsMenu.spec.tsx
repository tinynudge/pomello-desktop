import { createSignal } from 'solid-js';
import { renderDashboardComponent, screen } from '../__fixtures__/renderDashboardComponent';
import { ActionsMenu } from './ActionsMenu';

describe('UI - ActionsMenu', () => {
  it('should show the menu when the button is clicked', async () => {
    const { userEvent } = renderDashboardComponent(() => {
      // Make sure the actions work in a reactive context
      const [getLabel] = createSignal('One');

      return (
        <ActionsMenu
          actions={[
            {
              onClick: () => {},
              text: getLabel(),
            },
          ]}
        />
      );
    });

    expect(screen.queryByRole('menu', { name: 'More actions' })).not.toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'Show more actions' }));

    expect(screen.getByRole('menu', { name: 'More actions' })).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: 'One' })).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: 'One' })).toHaveFocus();
  });

  it('should allow custom labels', async () => {
    const { userEvent } = renderDashboardComponent(() => (
      <ActionsMenu
        actions={[
          {
            text: 'One',
            onClick: () => {},
          },
        ]}
        menuLabel="Secret menu"
        tooltip="Nothing to see here"
        triggerLabel="Do not press"
      />
    ));

    const button = screen.getByRole('button', { name: 'Do not press' });

    await userEvent.hover(button);

    expect(screen.getByRole('tooltip', { name: 'Nothing to see here' }));

    await userEvent.click(button);

    expect(screen.getByRole('menu', { name: 'Secret menu' })).toBeInTheDocument();
  });

  it('should trigger the menu item when Space is pressed', async () => {
    const handleItemClick = vi.fn();

    const { userEvent } = renderDashboardComponent(() => (
      <ActionsMenu
        actions={[
          {
            text: 'One',
            onClick: handleItemClick,
          },
        ]}
      />
    ));

    await userEvent.click(screen.getByRole('button', { name: 'Show more actions' }));
    await userEvent.keyboard(' ');

    expect(handleItemClick).toHaveBeenCalledOnce();
  });

  it('should trigger the menu item when Enter is pressed', async () => {
    const handleItemClick = vi.fn();

    const { userEvent } = renderDashboardComponent(() => (
      <ActionsMenu
        actions={[
          {
            text: 'One',
            onClick: handleItemClick,
          },
        ]}
      />
    ));

    await userEvent.click(screen.getByRole('button', { name: 'Show more actions' }));
    await userEvent.keyboard('{Enter}');

    expect(handleItemClick).toHaveBeenCalledOnce();
  });

  it('should close the menu when Escape is pressed', async () => {
    const { userEvent } = renderDashboardComponent(() => (
      <ActionsMenu
        actions={[
          {
            text: 'One',
            onClick: () => {},
          },
        ]}
      />
    ));

    await userEvent.click(screen.getByRole('button', { name: 'Show more actions' }));
    await userEvent.keyboard('{Escape}');

    expect(screen.queryByRole('menu', { name: 'More actions' })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Show more actions' })).toHaveFocus();
  });

  it('should close the menu when Tab is pressed', async () => {
    const { userEvent } = renderDashboardComponent(() => (
      <ActionsMenu
        actions={[
          {
            text: 'One',
            onClick: () => {},
          },
        ]}
      />
    ));

    await userEvent.click(screen.getByRole('button', { name: 'Show more actions' }));
    await userEvent.keyboard('{Tab}');

    expect(screen.queryByRole('menu', { name: 'More actions' })).not.toBeInTheDocument();
  });

  it('should focus on the next menu item when the down arrow is pressed', async () => {
    const { userEvent } = renderDashboardComponent(() => (
      <ActionsMenu
        actions={[
          {
            text: 'One',
            onClick: () => {},
          },
          {
            text: 'Two',
            onClick: () => {},
          },
        ]}
      />
    ));

    await userEvent.click(screen.getByRole('button', { name: 'Show more actions' }));
    await userEvent.keyboard('{ArrowDown}');

    expect(screen.getByRole('menuitem', { name: 'Two' })).toHaveFocus();
  });

  it('should focus on the previous menu item when the up arrow is pressed', async () => {
    const { userEvent } = renderDashboardComponent(() => (
      <ActionsMenu
        actions={[
          {
            text: 'One',
            onClick: () => {},
          },
          {
            text: 'Two',
            onClick: () => {},
          },
        ]}
      />
    ));

    await userEvent.click(screen.getByRole('button', { name: 'Show more actions' }));
    await userEvent.keyboard('{ArrowDown}');
    await userEvent.keyboard('{ArrowUp}');

    expect(screen.getByRole('menuitem', { name: 'One' })).toHaveFocus();
  });

  it('should focus on the first menu item when the down arrow is pressed on the last menu item', async () => {
    const { userEvent } = renderDashboardComponent(() => (
      <ActionsMenu
        actions={[
          {
            text: 'One',
            onClick: () => {},
          },
          {
            text: 'Two',
            onClick: () => {},
          },
          {
            text: 'Three',
            onClick: () => {},
          },
        ]}
      />
    ));

    await userEvent.click(screen.getByRole('button', { name: 'Show more actions' }));
    await userEvent.keyboard('{End}');
    await userEvent.keyboard('{ArrowDown}');

    expect(screen.getByRole('menuitem', { name: 'One' })).toHaveFocus();
  });

  it('should focus on the last menu item when the up arrow is pressed on the first menu item', async () => {
    const { userEvent } = renderDashboardComponent(() => (
      <ActionsMenu
        actions={[
          {
            text: 'One',
            onClick: () => {},
          },
          {
            text: 'Two',
            onClick: () => {},
          },
          {
            text: 'Three',
            onClick: () => {},
          },
        ]}
      />
    ));

    await userEvent.click(screen.getByRole('button', { name: 'Show more actions' }));
    await userEvent.keyboard('{ArrowUp}');

    expect(screen.getByRole('menuitem', { name: 'Three' })).toHaveFocus();
  });

  it('should focus on the first menu item when Home is pressed', async () => {
    const { userEvent } = renderDashboardComponent(() => (
      <ActionsMenu
        actions={[
          {
            text: 'One',
            onClick: () => {},
          },
          {
            text: 'Two',
            onClick: () => {},
          },
          {
            text: 'Three',
            onClick: () => {},
          },
        ]}
      />
    ));

    await userEvent.click(screen.getByRole('button', { name: 'Show more actions' }));
    await userEvent.keyboard('{ArrowUp}');
    await userEvent.keyboard('{Home}');

    expect(screen.getByRole('menuitem', { name: 'One' })).toHaveFocus();
  });

  it('should focus on the last menu item when Home is pressed', async () => {
    const { userEvent } = renderDashboardComponent(() => (
      <ActionsMenu
        actions={[
          {
            text: 'One',
            onClick: () => {},
          },
          {
            text: 'Two',
            onClick: () => {},
          },
          {
            text: 'Three',
            onClick: () => {},
          },
        ]}
      />
    ));

    await userEvent.click(screen.getByRole('button', { name: 'Show more actions' }));
    await userEvent.keyboard('{End}');

    expect(screen.getByRole('menuitem', { name: 'Three' })).toHaveFocus();
  });
});
