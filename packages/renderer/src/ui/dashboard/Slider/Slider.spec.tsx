import { renderDashboardComponent, screen } from '../__fixtures__/renderDashboardComponent';
import { Slider } from './Slider';

describe('UI - Slider', () => {
  it('should render the slider', async () => {
    renderDashboardComponent(() => <Slider />);

    expect(screen.getByRole('slider')).toBeInTheDocument();
  });

  it('should attach the ref', async () => {
    let sliderRef!: HTMLInputElement;

    renderDashboardComponent(() => <Slider ref={sliderRef} />);

    expect(screen.getByRole('slider')).toBe(sliderRef!);
  });
});
