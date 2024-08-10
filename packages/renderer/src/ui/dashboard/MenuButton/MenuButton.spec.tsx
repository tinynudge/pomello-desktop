import { createSignal } from 'solid-js';
import { renderDashboardComponent, screen } from '../__fixtures__/renderDashboardComponent';
import { MenuButton } from './MenuButton';

describe('UI - MenuButton', () => {
  it('should show the menu when the button is clicked', async () => {
    const { userEvent } = renderDashboardComponent(() => {
      // Make sure the actions work in a reactive context
      const [getLabel] = createSignal('One');

      return (
        <MenuButton
          menuItems={[
            {
              onClick: () => {},
              text: getLabel(),
            },
          ]}
          menuLabel="Secret menu"
        >
          Click me
        </MenuButton>
      );
    });

    expect(screen.queryByRole('menu', { name: 'Secret menu' })).not.toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'Click me' }));

    expect(screen.getByRole('menu', { name: 'Secret menu' })).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: 'One' })).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: 'One' })).toHaveFocus();
  });

  it('should use the button label as the menu label if provided', async () => {
    const { userEvent } = renderDashboardComponent(() => {
      return (
        <MenuButton
          aria-label="Secret menu"
          menuItems={[
            {
              onClick: () => {},
              text: 'Click me',
            },
          ]}
        >
          Click me
        </MenuButton>
      );
    });

    expect(screen.queryByRole('menu', { name: 'Secret menu' })).not.toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'Secret menu' }));

    expect(screen.getByRole('menu', { name: 'Secret menu' })).toBeInTheDocument();
  });

  it('should trigger the menu item when Space is pressed', async () => {
    const handleItemClick = vi.fn();

    const { userEvent } = renderDashboardComponent(() => (
      <MenuButton
        menuItems={[
          {
            text: 'One',
            onClick: handleItemClick,
          },
        ]}
      >
        Click me
      </MenuButton>
    ));

    await userEvent.click(screen.getByRole('button', { name: 'Click me' }));
    await userEvent.keyboard(' ');

    expect(handleItemClick).toHaveBeenCalledOnce();
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('should trigger the menu item when Enter is pressed', async () => {
    const handleItemClick = vi.fn();

    const { userEvent } = renderDashboardComponent(() => (
      <MenuButton
        menuItems={[
          {
            text: 'One',
            onClick: handleItemClick,
          },
        ]}
      >
        Click me
      </MenuButton>
    ));

    await userEvent.click(screen.getByRole('button', { name: 'Click me' }));
    await userEvent.keyboard('{Enter}');

    expect(handleItemClick).toHaveBeenCalledOnce();
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('should close the menu when Tab is pressed', async () => {
    const { userEvent } = renderDashboardComponent(() => (
      <MenuButton
        menuItems={[
          {
            text: 'One',
            onClick: () => {},
          },
        ]}
      >
        Click me
      </MenuButton>
    ));

    await userEvent.click(screen.getByRole('button', { name: 'Click me' }));
    await userEvent.keyboard('{Tab}');

    expect(screen.queryByRole('menu', { name: 'More actions' })).not.toBeInTheDocument();
  });

  it('should focus on the next menu item when the down arrow is pressed', async () => {
    const { userEvent } = renderDashboardComponent(() => (
      <MenuButton
        menuItems={[
          {
            text: 'One',
            onClick: () => {},
          },
          {
            text: 'Two',
            onClick: () => {},
          },
        ]}
      >
        Click me
      </MenuButton>
    ));

    await userEvent.click(screen.getByRole('button', { name: 'Click me' }));
    await userEvent.keyboard('{ArrowDown}');

    expect(screen.getByRole('menuitem', { name: 'Two' })).toHaveFocus();
  });

  it('should focus on the previous menu item when the up arrow is pressed', async () => {
    const { userEvent } = renderDashboardComponent(() => (
      <MenuButton
        menuItems={[
          {
            text: 'One',
            onClick: () => {},
          },
          {
            text: 'Two',
            onClick: () => {},
          },
        ]}
      >
        Click me
      </MenuButton>
    ));

    await userEvent.click(screen.getByRole('button', { name: 'Click me' }));
    await userEvent.keyboard('{ArrowDown}');
    await userEvent.keyboard('{ArrowUp}');

    expect(screen.getByRole('menuitem', { name: 'One' })).toHaveFocus();
  });

  it('should focus on the first menu item when the down arrow is pressed on the last menu item', async () => {
    const { userEvent } = renderDashboardComponent(() => (
      <MenuButton
        menuItems={[
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
      >
        Click me
      </MenuButton>
    ));

    await userEvent.click(screen.getByRole('button', { name: 'Click me' }));
    await userEvent.keyboard('{End}');
    await userEvent.keyboard('{ArrowDown}');

    expect(screen.getByRole('menuitem', { name: 'One' })).toHaveFocus();
  });

  it('should focus on the last menu item when the up arrow is pressed on the first menu item', async () => {
    const { userEvent } = renderDashboardComponent(() => (
      <MenuButton
        menuItems={[
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
      >
        Click me
      </MenuButton>
    ));

    await userEvent.click(screen.getByRole('button', { name: 'Click me' }));
    await userEvent.keyboard('{ArrowUp}');

    expect(screen.getByRole('menuitem', { name: 'Three' })).toHaveFocus();
  });

  it('should focus on the first menu item when Home is pressed', async () => {
    const { userEvent } = renderDashboardComponent(() => (
      <MenuButton
        menuItems={[
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
      >
        Click me
      </MenuButton>
    ));

    await userEvent.click(screen.getByRole('button', { name: 'Click me' }));
    await userEvent.keyboard('{ArrowUp}');
    await userEvent.keyboard('{Home}');

    expect(screen.getByRole('menuitem', { name: 'One' })).toHaveFocus();
  });

  it('should focus on the last menu item when Home is pressed', async () => {
    const { userEvent } = renderDashboardComponent(() => (
      <MenuButton
        menuItems={[
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
      >
        Click me
      </MenuButton>
    ));

    await userEvent.click(screen.getByRole('button', { name: 'Click me' }));
    await userEvent.keyboard('{End}');

    expect(screen.getByRole('menuitem', { name: 'Three' })).toHaveFocus();
  });
});
