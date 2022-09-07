import { vi } from 'vitest';
import Button from '.';
import mountComponent, { screen } from '../__fixtures__/mountComponent';

describe('UI - Button', () => {
  it('should render text properly', () => {
    mountComponent(<Button>Hello</Button>);

    expect(screen.getByRole('button')).toHaveTextContent('Hello');
  });

  it('should call a handler when click', () => {
    const onClick = vi.fn();
    mountComponent(<Button onClick={onClick}>Hello</Button>);

    screen.getByRole('button').click();

    expect(onClick).toHaveBeenCalled();
  });
});
