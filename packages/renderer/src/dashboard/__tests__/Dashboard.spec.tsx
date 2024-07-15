import { renderDashboard, screen } from '../__fixtures__/renderDashboard';

describe('Dashboard', () => {
  it('should render the menu correctly', () => {
    renderDashboard();

    const mainMenu = screen.getByRole('navigation', { name: 'Main menu' });
    const menuItems = screen.getAllByRole('link');

    expect(mainMenu).toBeInTheDocument();
    expect(menuItems.at(0)).toHaveTextContent('Productivity');
    expect(menuItems.at(1)).toHaveTextContent('Settings');
    expect(menuItems.at(2)).toHaveTextContent('Sounds');
    expect(menuItems.at(3)).toHaveTextContent('Keyboard shortcuts');
    expect(menuItems.at(4)).toHaveTextContent('Services');
  });
});
