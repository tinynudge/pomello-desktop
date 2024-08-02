import { renderDashboardComponent, screen } from '../__fixtures__/renderDashboardComponent';
import { ToggleSwitch } from './ToggleSwitch';

describe('UI - ToggleSwitch', () => {
  it('should render the toggle switch', async () => {
    renderDashboardComponent(() => <ToggleSwitch />);

    expect(screen.getByRole('checkbox')).toBeInTheDocument();
  });

  it('should trigger the onChange handler', async () => {
    const handleSwitchChange = vi.fn();

    const { userEvent } = renderDashboardComponent(() => (
      <ToggleSwitch onChange={handleSwitchChange} />
    ));

    await userEvent.click(screen.getByRole('checkbox'));

    expect(handleSwitchChange).toHaveBeenCalledOnce();
    expect(handleSwitchChange).toHaveBeenCalledWith(true);
  });
});
