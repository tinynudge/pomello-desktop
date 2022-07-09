import { vi } from 'vitest';
import Button from '.';
import mount, { screen } from '../__fixtures__/mount';

describe('UI - Button', () => {
  it('should render text properly', () => {
    mount(<Button>Hello</Button>);

    expect(screen.getByRole('button')).toHaveTextContent('Hello');
  });

  it('should call a handler when click', () => {
    const onClick = vi.fn();
    mount(<Button onClick={onClick}>Hello</Button>);

    screen.getByRole('button').click();

    expect(onClick).toHaveBeenCalled();
  });
});
