import { renderComponent, screen } from '../../__fixtures__/renderComponent';
import { ToggleSwitch } from './ToggleSwitch';

describe('UI - ToggleSwitch', () => {
  it('should render the toggle switch', async () => {
    renderComponent(() => <ToggleSwitch />);

    expect(screen.getByRole('checkbox')).toBeInTheDocument();
  });

  it('should trigger the onChange handler', async () => {
    const handleSwitchChange = vi.fn();

    const { userEvent } = renderComponent(() => <ToggleSwitch onChange={handleSwitchChange} />);

    await userEvent.click(screen.getByRole('checkbox'));

    expect(handleSwitchChange).toHaveBeenCalledOnce();
    expect(handleSwitchChange).toHaveBeenCalledWith(true);
  });
});
