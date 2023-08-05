import { screen, waitFor } from '@testing-library/svelte';
import { vi } from 'vitest';
import mountSelectField from './__fixtures__/mountSelectField';

describe('UI - Select Field', () => {
  it('should render the placeholder', async () => {
    mountSelectField({
      placeholder: 'Foobar',
    });

    expect(screen.getByRole('button')).toHaveTextContent('Foobar');
  });

  it('should tell the select window what items to show', () => {
    const { appApi } = mountSelectField({
      items: [
        { id: 'bulbasaur', label: 'Bulbasaur' },
        { id: 'charmander', label: 'Charmander' },
      ],
      placeholder: 'Pick a Pokemon',
    });

    expect(appApi.setSelectItems).toHaveBeenCalledWith({
      items: [
        { id: 'bulbasaur', label: 'Bulbasaur' },
        { id: 'charmander', label: 'Charmander' },
      ],
      placeholder: 'Pick a Pokemon',
    });
  });

  it('should open the select automatically if specified', async () => {
    const { appApi } = mountSelectField({
      defaultOpen: true,
    });

    await waitFor(() => {
      expect(appApi.showSelect).toHaveBeenCalled();
    });
  });

  it('should open the select when clicked', async () => {
    const { appApi, userEvent } = mountSelectField();

    await userEvent.click(screen.getByRole('button'));

    expect(appApi.showSelect).toHaveBeenCalled();
  });

  it('should open the select when the space bar is pressed', async () => {
    const { appApi, userEvent } = mountSelectField();

    await userEvent.keyboard(' ');

    expect(appApi.showSelect).toHaveBeenCalled();
  });

  it('should call the change handler when an option has been selected', async () => {
    const onSelectChange = vi.fn();

    const { emitAppApiEvent } = mountSelectField({
      onChange: onSelectChange,
    });

    emitAppApiEvent('onSelectChange', 'foo');

    expect(onSelectChange).toHaveBeenCalledWith('foo');
  });

  it('should reset the select when unmounted', async () => {
    const { result, appApi } = mountSelectField();

    result.rerender({});

    expect(appApi.resetSelect).toHaveBeenCalled();
  });
});
