import { renderDashboardComponent, screen } from '../__fixtures__/renderDashboardComponent';
import { Tooltip } from './Tooltip';

describe('UI - Tooltip', () => {
  it('should show and hide the tooltip on mouseover and mouseout', async () => {
    const { userEvent } = renderDashboardComponent(() => (
      <Tooltip text="Do not click">
        {tooltipTargetRef => <button ref={tooltipTargetRef}>Click me</button>}
      </Tooltip>
    ));

    await userEvent.hover(screen.getByRole('button'));

    expect(screen.getByRole('tooltip', { name: 'Do not click' })).toBeInTheDocument();

    await userEvent.unhover(screen.getByRole('button'));

    expect(screen.queryByRole('tooltip', { name: 'Do not click' })).not.toBeInTheDocument();
  });

  it('should show and hide the tooltip on focus and blur', async () => {
    renderDashboardComponent(() => (
      <Tooltip text="Do not click">
        {tooltipTargetRef => <button ref={tooltipTargetRef}>Click me</button>}
      </Tooltip>
    ));

    screen.getByRole('button').focus();

    expect(screen.getByRole('tooltip', { name: 'Do not click' })).toBeInTheDocument();

    screen.getByRole('button').blur();

    expect(screen.queryByRole('tooltip', { name: 'Do not click' })).not.toBeInTheDocument();
  });

  it('should not show the tooltip if isForceHidden is enabled', async () => {
    const { userEvent } = renderDashboardComponent(() => (
      <Tooltip text="Do not click" isForceHidden={true}>
        {tooltipTargetRef => <button ref={tooltipTargetRef}>Click me</button>}
      </Tooltip>
    ));

    screen.getByRole('button').focus();

    expect(screen.queryByRole('tooltip', { name: 'Do not click' })).not.toBeInTheDocument();

    await userEvent.hover(screen.getByRole('button'));

    expect(screen.queryByRole('tooltip', { name: 'Do not click' })).not.toBeInTheDocument();
  });
});
