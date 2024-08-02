import { JSX } from 'solid-js';
import { vi } from 'vitest';
import { renderAppComponent, screen } from '../__fixtures__/renderAppComponent';
import { InputField } from './InputField';

describe('UI - Input Field', () => {
  let handleInputChange: JSX.EventHandler<HTMLInputElement, InputEvent>;
  let value: string;

  beforeEach(() => {
    handleInputChange = vi.fn(event => {
      value = event.currentTarget.value;
    });

    value = '';
  });

  it('should render the placeholder', () => {
    renderAppComponent(() => <InputField placeholder="Hello world" />);

    expect(screen.getByPlaceholderText('Hello world')).toBeInTheDocument();
  });

  it('should call the onInput handler when updated', async () => {
    const { userEvent } = renderAppComponent(() => (
      <InputField value={value} onInput={handleInputChange} />
    ));

    await userEvent.type(screen.getByRole('textbox'), 'f');

    expect(handleInputChange).toHaveBeenCalled();
    expect(value).toBe('f');
  });

  it('should call the onEscape handler when content is entered', async () => {
    const handleInputEscape = vi.fn();

    const { userEvent } = renderAppComponent(() => <InputField onEscape={handleInputEscape} />);

    await userEvent.type(screen.getByRole('textbox'), '{Escape}');

    expect(handleInputEscape).toHaveBeenCalled();
  });

  it('should call the onSubmit handler when content is entered', async () => {
    const handleInputSubmit = vi.fn();

    const { userEvent } = renderAppComponent(() => <InputField onSubmit={handleInputSubmit} />);

    await userEvent.type(screen.getByRole('textbox'), '{Enter}');

    expect(handleInputSubmit).toHaveBeenCalled();
  });
});
