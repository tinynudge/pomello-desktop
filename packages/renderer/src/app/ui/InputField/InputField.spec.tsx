import { ChangeEvent, ChangeEventHandler } from 'react';
import { vi } from 'vitest';
import InputField from '.';
import mountComponent, { screen } from '../__fixtures__/mountComponent';

describe('UI - Input Field', () => {
  let handleInputChange: ChangeEventHandler<HTMLInputElement>;
  let value: string;

  beforeEach(() => {
    handleInputChange = vi.fn((event: ChangeEvent<HTMLInputElement>) => {
      value = event.currentTarget.value;
    });

    value = '';
  });

  it('should render the placeholder', () => {
    mountComponent(<InputField placeholder="Hello world" />);

    expect(screen.getByPlaceholderText('Hello world')).toBeInTheDocument();
  });

  it('should call the onChange handler when updated', async () => {
    const { userEvent } = mountComponent(<InputField value={value} onChange={handleInputChange} />);

    await userEvent.type(screen.getByRole('textbox'), 'f');

    expect(handleInputChange).toHaveBeenCalled();
    expect(value).toBe('f');
  });

  it('should call the onEscape handler when content is entered', async () => {
    const handleInputEscape = vi.fn();

    const { userEvent } = mountComponent(<InputField onEscape={handleInputEscape} />);

    await userEvent.type(screen.getByRole('textbox'), '{Escape}');

    expect(handleInputEscape).toHaveBeenCalled();
  });

  it('should call the onSubmit handler when content is entered', async () => {
    const handleInputSubmit = vi.fn();

    const { userEvent } = mountComponent(<InputField onSubmit={handleInputSubmit} />);

    await userEvent.type(screen.getByRole('textbox'), '{Enter}');

    expect(handleInputSubmit).toHaveBeenCalled();
  });
});
