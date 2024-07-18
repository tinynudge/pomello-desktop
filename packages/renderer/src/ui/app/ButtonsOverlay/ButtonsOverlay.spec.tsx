import { vi } from 'vitest';
import { renderComponent, screen } from '../__fixtures__/renderComponent';
import { ButtonsOverlay } from './ButtonsOverlay';

describe('UI - Buttons Overlay', () => {
  it('should render properly', () => {
    renderComponent(() => (
      <ButtonsOverlay
        buttons={[
          { content: 'One', onClick: () => null },
          { content: 'Two', onClick: () => null },
        ]}
      >
        <h1>My heading</h1>
      </ButtonsOverlay>
    ));

    expect(screen.getByRole('heading', { name: 'My heading' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'One' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Two' })).toBeInTheDocument();
  });

  it('should call a handler when a button is clicked', async () => {
    const handleButtonClick = vi.fn();

    const { userEvent } = renderComponent(() => (
      <ButtonsOverlay
        buttons={[
          {
            content: 'Click me',
            onClick: handleButtonClick,
          },
        ]}
      />
    ));

    await userEvent.click(screen.getByRole('button', { name: 'Click me' }));

    expect(handleButtonClick).toHaveBeenCalled();
  });
});
